// tests/InputField.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InputField from '../src/components/InputField.vue'

describe('InputField', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(InputField, {
            props: {
                modelValue: '',
                label: 'Email'
            }
        })
    })

    it('emet l’esdeveniment update:modelValue quan s’escriu a l’input', async () => {
        // Act - Simula escriure a l'input
        const input = wrapper.find('input')
        await input.setValue('test@example.com')

        // Assert - Comprova que s'ha emès l'event amb el valor correcte
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test@example.com'])

        // O alternativamente:
        // expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
        // expect(wrapper.emitted('update:modelValue')[0][0]).toBe('test@example.com')
    })

    it('actualitza el valor de modelValue correctament', async () => {
        await wrapper.setProps({ modelValue: 'test@example.com' })
        expect(wrapper.find('input').element.value).toBe('test@example.com')
    })

    it('emet el valor correctament pas a pas', async () => {
        const input = wrapper.find('input')

        // Simula teclejant lletra a lletra
        await input.setValue('t')
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['t'])

        await input.setValue('te')
        expect(wrapper.emitted('update:modelValue')[1]).toEqual(['te'])

        await input.setValue('test@example.com')
        expect(wrapper.emitted('update:modelValue').pop()).toEqual(['test@example.com'])
    })
})