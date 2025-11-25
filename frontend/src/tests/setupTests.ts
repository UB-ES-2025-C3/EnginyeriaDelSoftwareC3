import { beforeAll, afterAll, vi } from 'vitest'

let warnSpy: ReturnType<typeof vi.spyOn> | undefined

beforeAll(() => {
  const originalWarn = console.warn
  warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args: Parameters<typeof console.warn>) => {
    if (typeof args[0] === 'string' && args[0].includes('No match found for location')) {
      return
    }
    originalWarn(...args)
  })
})

afterAll(() => {
  warnSpy?.mockRestore()
})
