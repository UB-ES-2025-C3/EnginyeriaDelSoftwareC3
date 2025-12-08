import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GameCard from '@/views/GameCard.vue'
import { api } from '@/services/api'
import { auth } from '@/services/auth'

// Mock dependencies
const mockRoute = {
    params: { id: '123' }
}

const mockRouter = {
    push: vi.fn()
}

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter
}))

// Mock API
vi.mock('@/services/api', () => ({
    api: {
        getGame: vi.fn(),
        getGameReviews: vi.fn(),
        createReview: vi.fn()
    }
}))

// Mock Auth
vi.mock('@/services/auth', () => ({
    auth: {
        state: {
            token: null,
            user: null
        },
        logout: vi.fn()
    }
}))

describe('GameCard.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset auth state
        auth.state.token = null
        auth.state.user = null
        // Mock window.scrollTo
        global.window.scrollTo = vi.fn()
    })

    it('renders correctly and loads game data', async () => {
        // Mock API responses
        const mockGame = {
            _id: '123',
            name: 'Test Game',
            genre: 'Action',
            year: 2023,
            platform: 'PC',
            image: 'http://test.com/image.jpg',
            reviews: []
        }
        const mockReviews = { reviews: [] }

        vi.mocked(api.getGame).mockResolvedValue(mockGame as any)
        vi.mocked(api.getGameReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(GameCard, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })

        await flushPromises()

        expect(api.getGame).toHaveBeenCalledWith('123')
        expect(wrapper.text()).toContain('Test Game')
        expect(wrapper.text()).toContain('Action')
    })

    it('calculates avgRating correctly', async () => {
        const mockGame = {
            _id: '123',
            name: 'Test Game',
            reviews: []
        }
        // Mock reviews with stars
        const mockReviews = {
            reviews: [
                { stars: 5, text: 'Great' },
                { stars: 3, text: 'Okay' }
            ]
        }

        vi.mocked(api.getGame).mockResolvedValue(mockGame as any)
        vi.mocked(api.getGameReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(GameCard, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        // (5 + 3) / 2 = 4
        expect(wrapper.text()).toContain('4.0')
    })

    it('handles NaN or 0 reviews for avgRating', async () => {
        const mockGame = { _id: '123', name: 'Test Game' }
        const mockReviews = { reviews: [] }

        vi.mocked(api.getGame).mockResolvedValue(mockGame as any)
        vi.mocked(api.getGameReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(GameCard, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        expect(wrapper.text()).toContain('Sense ressenyes')
    })

    it('shows validation error when submitting empty review', async () => {
        // Mock logged in user
        auth.state.token = 'fake-token'
        auth.state.user = { id: 'u1', name: 'User', email: 'u@u.com' } as any

        const mockGame = { _id: '123', name: 'Test Game' }
        vi.mocked(api.getGame).mockResolvedValue(mockGame as any)
        vi.mocked(api.getGameReviews).mockResolvedValue({ reviews: [] } as any)

        const wrapper = mount(GameCard, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        // Open review form
        const toggleBtn = wrapper.findAll('button').find(b => b.text().includes('Escriure una ressenya'))
        await toggleBtn?.trigger('click')

        // Find the submit button and click it without entering text
        const submitBtn = wrapper.findAll('button').find(b => b.text().includes('Publicar ressenya'))
        expect(submitBtn).toBeDefined()
        await submitBtn?.trigger('click')

        await flushPromises()

        expect(wrapper.text()).toContain('El text de la ressenya no pot estar buit')
        expect(api.createReview).not.toHaveBeenCalled()
    })

    it('successfully submits a review and updates the list', async () => {
        // Mock logged in user
        auth.state.token = 'fake-token'
        auth.state.user = { id: 'u1', name: 'User', email: 'u@u.com' } as any

        const mockGame = { _id: '123', name: 'Test Game' }
        vi.mocked(api.getGame).mockResolvedValue(mockGame as any)
        vi.mocked(api.getGameReviews).mockResolvedValue({ reviews: [] } as any)

        const newReview = {
            _id: 'r1',
            stars: 5,
            text: 'Awesome game!',
            user: { name: 'User' },
            createdAt: new Date().toISOString()
        }

        vi.mocked(api.createReview).mockResolvedValue({
            message: 'Success',
            review: newReview as any
        })

        const wrapper = mount(GameCard, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        // Open form
        const toggleBtn = wrapper.findAll('button').find(b => b.text().includes('Escriure una ressenya'))
        await toggleBtn?.trigger('click')

        // Fill form
        const textarea = wrapper.find('textarea')
        await textarea.setValue('Awesome game!')

        // Submit
        const submitBtn = wrapper.findAll('button').find(b => b.text().includes('Publicar ressenya'))
        await submitBtn?.trigger('click')

        await flushPromises()

        expect(api.createReview).toHaveBeenCalledWith('fake-token', '123', {
            stars: 5,
            text: 'Awesome game!'
        })

        // Verify review is added to the list
        expect(wrapper.text()).toContain('Awesome game!')
        expect(wrapper.text()).toContain('User')
    })
})
