import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(__dirname, './index.css'), 'utf8')

describe('notification theme tokens', () => {
  it('defines semantic notification tokens in the root theme', () => {
    expect(css).toContain('--success-background')
    expect(css).toContain('--success-border')
    expect(css).toContain('--error-background')
    expect(css).toContain('--error-border')
    expect(css).toContain('--warning-background')
    expect(css).toContain('--warning-border')
    expect(css).toContain('--info-background')
    expect(css).toContain('--info-border')
  })

  it('defines the same notification tokens for dark mode', () => {
    expect(css).toMatch(/\.dark\s*{[\s\S]*--success-background:/)
    expect(css).toMatch(/\.dark\s*{[\s\S]*--error-background:/)
    expect(css).toMatch(/\.dark\s*{[\s\S]*--warning-background:/)
    expect(css).toMatch(/\.dark\s*{[\s\S]*--info-background:/)
  })

  it('does not use black styling for success backgrounds', () => {
    expect(css).not.toMatch(/--success-background:\s*0 0% 0%/)
  })
})
