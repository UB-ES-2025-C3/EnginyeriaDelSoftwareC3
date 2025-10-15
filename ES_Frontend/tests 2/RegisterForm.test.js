import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import RegisterForm from '../src/components/RegisterForm.vue'
import axios from 'axios'

vi.mock('axios')

describe('RegisterForm', () => {
    it('renderitza el formulari amb tots els camps', () => {
        render(RegisterForm)

        expect(screen.getByLabelText('Nom complet')).toBeInTheDocument()
        expect(screen.getByLabelText('Correu electrònic')).toBeInTheDocument()
        expect(screen.getByLabelText('Contrasenya')).toBeInTheDocument()
        expect(screen.getByLabelText('Confirma la contrasenya')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Registrar-se' })).toBeInTheDocument()
    })

it('mostra errors de validació quan els camps són invàlids', async () => {
    render(RegisterForm)

    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correu electrònic'), 'invalid-email') // Correu invàlid
    await user.type(screen.getByLabelText('Contrasenya'), 'short') // Contrasenya curta
    await user.type(screen.getByLabelText('Confirma la contrasenya'), 'different') // Contrasenyes diferents

    const submitButton = screen.getByRole('button', { name: 'Registrar-se' })
    await fireEvent.click(submitButton)

    await waitFor(
        () => {
            expect(screen.getByText(/Correu electrònic no vàlid/)).toBeInTheDocument()
            expect(screen.getByText(/La contrasenya ha de tenir almenys 8 caràcters/)).toBeInTheDocument()
            expect(screen.getByText(/Les contrasenyes no coincideixen!/)).toBeInTheDocument() // Inclou "!"
        },
        { timeout: 2000 }
    )
})

    it('envia el formulari correctament quan les dades són vàlides', async () => {
        axios.post.mockResolvedValue({ data: {}, status: 200 })

        render(RegisterForm)

        const user = userEvent.setup()
        await user.type(screen.getByLabelText('Nom complet'), 'Joan Pérez')
        await user.type(screen.getByLabelText('Correu electrònic'), 'joan@example.com')
        await user.type(screen.getByLabelText('Contrasenya'), 'password123')
        await user.type(screen.getByLabelText('Confirma la contrasenya'), 'password123')

        const submitButton = screen.getByRole('button', { name: 'Registrar-se' })
        await fireEvent.click(submitButton)

        await waitFor(
            () => {
                expect(axios.post).toHaveBeenCalledWith('/api/register', {
                    name: 'Joan Pérez',
                    email: 'joan@example.com',
                    password: 'password123'
                })
                expect(screen.getByText(/Compte creat correctament/)).toBeInTheDocument()
            },
            { timeout: 2000 }
        )
    })

    it('mostra un error quan el correu ja existeix', async () => {
        axios.post.mockRejectedValue({
            response: { data: { error: 'EMAIL_EXISTS' }, status: 400 }
        })

        render(RegisterForm)

        const user = userEvent.setup()
        await user.type(screen.getByLabelText('Nom complet'), 'Joan Pérez')
        await user.type(screen.getByLabelText('Correu electrònic'), 'joan@example.com')
        await user.type(screen.getByLabelText('Contrasenya'), 'password123')
        await user.type(screen.getByLabelText('Confirma la contrasenya'), 'password123')

        const submitButton = screen.getByRole('button', { name: 'Registrar-se' })
        await fireEvent.click(submitButton)

        await waitFor(
            () => {
                expect(screen.getByText(/Aquest correu ja està en ús/)).toBeInTheDocument()
            },
            { timeout: 2000 }
        )
    })
})