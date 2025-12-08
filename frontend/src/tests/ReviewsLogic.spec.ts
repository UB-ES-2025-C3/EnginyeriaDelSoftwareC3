import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Reviews from '@/views/Reviews.vue'
import { api } from '@/services/api'
import { auth } from '@/services/auth'

const mockRouter = {
    push: vi.fn()
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}))

// Mock API
vi.mock('@/services/api', () => ({
    api: {
        getAllReviews: vi.fn()
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

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value.toString() }),
        clear: () => { store = {} },
        removeItem: (key: string) => { delete store[key] }
    }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Reviews.vue Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.clear()
        // Reset auth
        auth.state.token = null
        auth.state.user = null
    })

    it('loads reviews and initializes votes', async () => {
        // Login to see votes
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any

        const mockReviews = [
            { _id: 'r1', text: 'Review 1', stars: 5, likes: 10, dislikes: 2 }
        ]
        vi.mocked(api.getAllReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(Reviews, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        expect(api.getAllReviews).toHaveBeenCalled()

        expect(wrapper.text()).toContain('Review 1')
        // Check initial likes count
        // The button contains the text
        const likeBtn = wrapper.findAll('button').find(b => b.text().includes('👍'))
        expect(likeBtn?.text()).toContain('10')
    })

    it('User likes a neutral comment -> likes count increases, userVote becomes like', async () => {
        // Login user
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any

        const mockReviews = [
            { _id: 'r1', text: 'Review 1', stars: 5, likes: 10, dislikes: 2, userVote: null }
        ]
        vi.mocked(api.getAllReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(Reviews, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        // Find like button for first review
        // The button has text containing the likes count
        const likeBtn = wrapper.findAll('button').find(b => b.text().includes('👍'))

        await likeBtn?.trigger('click')

        // Likes should increase to 11
        expect(wrapper.text()).toContain('11')

        // Verify localStorage was updated
        expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('User likes a comment they already liked -> likes count decreases (toggle off), userVote becomes null', async () => {
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any

        const initialVotes = {
            'r1': { likes: 11, dislikes: 2, userVote: 'like' }
        }
        localStorageMock.setItem('checkpoint_review_votes_u1', JSON.stringify(initialVotes))

        const mockReviews = [
            { _id: 'r1', text: 'Review 1', stars: 5, likes: 10, dislikes: 2 } // API returns base state
        ]
        vi.mocked(api.getAllReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(Reviews, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        // Should show 11 likes initially because of localStorage override
        expect(wrapper.text()).toContain('11')

        const likeBtn = wrapper.findAll('button').find(b => b.text().includes('👍'))
        await likeBtn?.trigger('click')

        // Should decrease to 10
        expect(wrapper.text()).toContain('10')
    })

    it('User dislikes a comment they previously liked -> likes decreases, dislikes increases, userVote switches', async () => {
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any

        // Seed localStorage with 'like'
        const initialVotes = {
            'r1': { likes: 11, dislikes: 2, userVote: 'like' }
        }
        localStorageMock.setItem('checkpoint_review_votes_u1', JSON.stringify(initialVotes))

        const mockReviews = [
            { _id: 'r1', text: 'Review 1', stars: 5, likes: 10, dislikes: 2 }
        ]
        vi.mocked(api.getAllReviews).mockResolvedValue(mockReviews as any)

        const wrapper = mount(Reviews, {
            global: {
                stubs: {
                    'router-link': true,
                    'NavBarComponent': true,
                    'FooterComponent': true
                }
            }
        })
        await flushPromises()

        // Click dislike button
        const dislikeBtn = wrapper.findAll('button').find(b => b.text().includes('👎'))
        await dislikeBtn?.trigger('click')

        const likeBtn = wrapper.findAll('button').find(b => b.text().includes('👍'))
        const dislikeBtnAfter = wrapper.findAll('button').find(b => b.text().includes('👎'))

        expect(likeBtn?.text()).toContain('10')
        expect(dislikeBtnAfter?.text()).toContain('3')
    })
})
