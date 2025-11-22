import { describe, it, expect } from 'vitest'
import { settingsSchema } from '../constants/settings'

describe('Settings Validation con Zod', () => {
    it('valida configuración correcta', () => {
        const validSettings = {
            studyTime: 25,
            breakTime: 5,
            longBreakTime: 15,
            sessions: 4,
            autoMode: true,
            soundEnabled: true,
            theme: 'kitty'
        }

        const result = settingsSchema.safeParse(validSettings)
        expect(result.success).toBe(true)
    })

    it('rechaza studyTime fuera de rango', () => {
        const invalidSettings = {
            studyTime: 150, // Máximo es 120
            breakTime: 5,
            longBreakTime: 15,
            sessions: 4,
            autoMode: true,
            soundEnabled: true,
            theme: 'kitty'
        }

        const result = settingsSchema.safeParse(invalidSettings)
        expect(result.success).toBe(false)
    })

    it('rechaza breakTime negativo', () => {
        const invalidSettings = {
            studyTime: 25,
            breakTime: -5, // No puede ser negativo
            longBreakTime: 15,
            sessions: 4,
            autoMode: true,
            soundEnabled: true,
            theme: 'kitty'
        }

        const result = settingsSchema.safeParse(invalidSettings)
        expect(result.success).toBe(false)
    })

    it('aplica valores por defecto cuando faltan campos', () => {
        const partialSettings = {
            studyTime: 30
        }

        const result = settingsSchema.parse(partialSettings)
        expect(result.breakTime).toBe(5) // Default
        expect(result.sessions).toBe(5) // Default
        expect(result.autoMode).toBe(false) // Default
    })
})
