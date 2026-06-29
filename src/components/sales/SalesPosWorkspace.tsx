'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ErrorState } from '@/components/ErrorState'
import { useCreateSale } from '@/hooks/mutations/useSales'
import { useCustomers } from '@/hooks/queries/useCustomers'
import { useMedicines } from '@/hooks/queries/useMedicines'
import { useAuthStore } from '@/store/authStore'
import type { Medicine } from '@/types/inventory'
import type { PaymentMethod } from '@/types/sales'
import { CartPanel } from './pos/CartPanel'
import { MedicineDetailsSheet } from './pos/MedicineDetailsSheet'
import { MedicineResultsCard } from './pos/MedicineResultsCard'
import { MedicineSearchCard } from './pos/MedicineSearchCard'
import { PosHeader } from './pos/PosHeader'
import type { PosCartItem, PosCartLine } from './pos/types'
import {
  buildPrescriptionNotes,
  formatPosDate,
  getMaxSellableUnits,
  getSaleUnits,
  getUnitConversion,
  getUnitPriceFromBase,
  isMedicineExpired,
  matchesMedicineQuery,
  POS_RESULT_LIMIT,
} from './pos/utils'

export function SalesPosWorkspace() {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [drawerQuantity, setDrawerQuantity] = useState(1)
  const [drawerUnitName, setDrawerUnitName] = useState('')
  const [cart, setCart] = useState<PosCartItem[]>([])
  const [customerId, setCustomerId] = useState('walk-in')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [amountPaid, setAmountPaid] = useState('')
  const [notes, setNotes] = useState('')

  const user = useAuthStore((state) => state.user)
  const createSale = useCreateSale()
  const { data: medicines = [], isLoading: medicinesLoading, isError: medicinesError, refetch } = useMedicines()
  const { data: customers = [], isLoading: customersLoading } = useCustomers()

  const safeMedicines = useMemo(() => (Array.isArray(medicines) ? medicines : []), [medicines])
  const safeCustomers = useMemo(() => (Array.isArray(customers) ? customers : []), [customers])

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), 220)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const filteredMedicines = useMemo(() => {
    return safeMedicines
      .filter((medicine) => matchesMedicineQuery(medicine, searchQuery))
      .sort((left, right) => left.name.localeCompare(right.name))
      .slice(0, POS_RESULT_LIMIT)
  }, [safeMedicines, searchQuery])

  const activeHighlightedIndex = filteredMedicines.length === 0 ? -1 : Math.min(highlightedIndex, filteredMedicines.length - 1)
  const medicinesById = useMemo(() => new Map(safeMedicines.map((medicine) => [medicine.id, medicine])), [safeMedicines])
  const cartItems = useMemo<PosCartLine[]>(() => cart.flatMap((item) => {
    const medicine = medicinesById.get(item.medicineId)
    if (!medicine) return []
    const conversion = getUnitConversion(medicine, item.unitName)
    const unitPrice = getUnitPriceFromBase(medicine.selling_price, conversion.factor_to_base_unit)
    return [{
      ...item,
      medicine,
      factorToBaseUnit: conversion.factor_to_base_unit,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    }]
  }), [cart, medicinesById])

  const selectedCustomer = customerId === 'walk-in' ? null : safeCustomers.find((customer) => customer.id === customerId) ?? null
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const numericAmountPaid = Number(amountPaid || 0)
  const amountDue = Math.max(subtotal - numericAmountPaid, 0)
  const changeDue = Math.max(numericAmountPaid - subtotal, 0)

  const resetSale = () => {
    setSearchInput('')
    setSearchQuery('')
    setHighlightedIndex(0)
    setSelectedMedicine(null)
    setDrawerQuantity(1)
    setDrawerUnitName('')
    setCart([])
    setCustomerId('walk-in')
    setPaymentMethod('cash')
    setAmountPaid('')
    setNotes('')
  }

  useEffect(() => {
    if (!selectedMedicine) return
    const defaultUnit = getSaleUnits(selectedMedicine)[0]?.unit_name ?? selectedMedicine.base_unit ?? selectedMedicine.unit
    setDrawerUnitName(defaultUnit)
    setDrawerQuantity(1)
  }, [selectedMedicine])

  const addMedicineToCart = (medicine: Medicine, quantity = 1, unitName?: string) => {
    const resolvedUnitName = unitName || getSaleUnits(medicine)[0]?.unit_name || medicine.base_unit || medicine.unit
    const maxSellableUnits = getMaxSellableUnits(medicine, resolvedUnitName)
    if (isMedicineExpired(medicine) || maxSellableUnits <= 0) return

    const lineId = `${medicine.id}:${resolvedUnitName}`
    setCart((current) => {
      const existing = current.find((item) => item.lineId === lineId)
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, maxSellableUnits)
      return existing
        ? current.map((item) => item.lineId === lineId ? { ...item, quantity: nextQuantity } : item)
        : [...current, { lineId, medicineId: medicine.id, quantity: nextQuantity, unitName: resolvedUnitName }]
    })
    setSelectedMedicine(null)
    setDrawerQuantity(1)
    setDrawerUnitName('')
  }

  const updateCartQuantity = (item: PosCartLine, quantity: number) => {
    if (quantity <= 0) return setCart((current) => current.filter((entry) => entry.lineId !== item.lineId))
    const maxSellableUnits = getMaxSellableUnits(item.medicine, item.unitName)
    setCart((current) => current.map((entry) => (
      entry.lineId === item.lineId
        ? { ...entry, quantity: Math.min(quantity, maxSellableUnits) }
        : entry
    )))
  }

  const handleSubmitSale = async () => {
    if (cartItems.length === 0) return toast.error('Add at least one medicine to the cart')
    const prescriptionItems = cartItems.map((item) => item.medicine).filter((medicine) => medicine.requires_prescription)

    try {
      await createSale.mutateAsync({
        customer: selectedCustomer?.id,
        payment_method: paymentMethod,
        notes: buildPrescriptionNotes(notes, prescriptionItems),
        payment_amount: amountPaid ? numericAmountPaid.toFixed(2) : undefined,
        items: cartItems.map((item) => ({
          medicine: item.medicine.id,
          quantity: item.quantity,
          unit_name: item.unitName,
          batch_number: item.medicine.batch_number || undefined,
        })),
      })
      toast.success('Sale completed successfully')
      resetSale()
    } catch {
      toast.error('Failed to complete sale')
    }
  }

  if (medicinesError) return <ErrorState title="Unable to load medicines" description="The selling workspace needs medicine inventory before items can be added to a sale." onRetry={refetch} />

  return (
    <>
      <div className="space-y-6">
        <PosHeader dateLabel={formatPosDate(new Date())} username={user?.username} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)]">
          <div className="space-y-6">
            <MedicineSearchCard isLoading={medicinesLoading} searchInput={searchInput} totalMedicines={safeMedicines.length} onChange={(value) => { setSearchInput(value); setHighlightedIndex(0) }} onKeyDown={(event) => {
              if (event.key === 'ArrowDown') return setHighlightedIndex((current) => (current + 1) % Math.max(filteredMedicines.length, 1))
              if (event.key === 'ArrowUp') return setHighlightedIndex((current) => (current - 1 + filteredMedicines.length) % Math.max(filteredMedicines.length, 1))
              if (event.key === 'Enter' && activeHighlightedIndex >= 0) addMedicineToCart(filteredMedicines[activeHighlightedIndex], 1)
            }} />
            <MedicineResultsCard
              medicines={filteredMedicines}
              isLoading={medicinesLoading}
              highlightedIndex={activeHighlightedIndex}
              searchQuery={searchQuery}
              onAddToCart={(medicine, unitName) => addMedicineToCart(medicine, 1, unitName)}
              onOpenDetails={setSelectedMedicine}
            />
          </div>

          <div className="xl:sticky xl:top-4">
            <CartPanel
              amountDue={amountDue}
              amountPaid={amountPaid}
              cartItems={cartItems}
              changeDue={changeDue}
              customerId={customerId}
              customers={safeCustomers}
              customersLoading={customersLoading}
              isSubmitting={createSale.isPending}
              notes={notes}
              numericAmountPaid={numericAmountPaid}
              paymentMethod={paymentMethod}
              selectedCustomer={selectedCustomer}
              subtotal={subtotal}
              onAmountPaidChange={setAmountPaid}
              onClear={resetSale}
              onCustomerChange={setCustomerId}
              onNotesChange={setNotes}
              onPaymentMethodChange={setPaymentMethod}
              onRemoveItem={(lineId) => setCart((current) => current.filter((item) => item.lineId !== lineId))}
              onSubmit={handleSubmitSale}
              onUpdateQuantity={updateCartQuantity}
            />
          </div>
        </div>
      </div>

      <MedicineDetailsSheet
        medicine={selectedMedicine}
        quantity={drawerQuantity}
        unitName={drawerUnitName}
        onAddToCart={addMedicineToCart}
        onClose={() => { setSelectedMedicine(null); setDrawerQuantity(1); setDrawerUnitName('') }}
        onQuantityChange={setDrawerQuantity}
        onUnitNameChange={(value) => {
          setDrawerUnitName(value)
          if (selectedMedicine) {
            const maxSellableUnits = getMaxSellableUnits(selectedMedicine, value)
            setDrawerQuantity((current) => Math.min(current || 1, Math.max(maxSellableUnits, 1)))
          }
        }}
      />
    </>
  )
}
