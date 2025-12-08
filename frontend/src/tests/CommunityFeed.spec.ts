import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CommunityFeed from '@/components/CommunityFeed.vue'
import { api } from '@/services/api'
import { auth } from '@/services/auth'

// Mock API
vi.mock('@/services/api', () => ({
    api: {
        getPosts: vi.fn(),
        createPost: vi.fn()
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

describe('CommunityFeed.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        auth.state.token = null
        auth.state.user = null
    })

    it('renders posts correctly', async () => {
        const mockPosts = [
            {
                _id: 'p1',
                text: 'Hello World',
                createdAt: new Date().toISOString(),
                user: { name: 'Test User' }
            }
        ]
        vi.mocked(api.getPosts).mockResolvedValue(mockPosts as any)

        const wrapper = mount(CommunityFeed, {
            global: {
                stubs: {
                    'router-link': true
                }
            }
        })
        await flushPromises()

        expect(api.getPosts).toHaveBeenCalled()
        expect(wrapper.text()).toContain('Hello World')
        expect(wrapper.text()).toContain('Test User')
    })

    it('shows login message when not authenticated', async () => {
        vi.mocked(api.getPosts).mockResolvedValue([])

        const wrapper = mount(CommunityFeed, {
            global: {
                stubs: {
                    'router-link': {
                        template: '<a><slot /></a>'
                    }
                }
            }
        })
        await flushPromises()

        expect(wrapper.text()).toContain('Inicia sessió per publicar')
        expect(wrapper.find('textarea').exists()).toBe(false)
    })

    it('shows create form when authenticated', async () => {
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any
        vi.mocked(api.getPosts).mockResolvedValue([])

        const wrapper = mount(CommunityFeed, {
            global: {
                stubs: {
                    'router-link': true
                }
            }
        })
        await flushPromises()

        expect(wrapper.find('textarea').exists()).toBe(true)
        expect(wrapper.text()).toContain('Comparteix amb la comunitat')
    })

    it('validates empty post', async () => {
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any
        vi.mocked(api.getPosts).mockResolvedValue([])

        const wrapper = mount(CommunityFeed, {
            global: {
                stubs: {
                    'router-link': true
                }
            }
        })
        await flushPromises()

        const btn = wrapper.find('button')
        // Button should be disabled if text is empty
        expect(btn.attributes('disabled')).toBeDefined()
    })

    it('submits a new post successfully', async () => {
        auth.state.token = 'token'
        auth.state.user = { id: 'u1', name: 'User' } as any
        vi.mocked(api.getPosts).mockResolvedValue([])

        const newPost = {
            _id: 'p2',
            text: 'New Post',
            createdAt: new Date().toISOString(),
            user: { name: 'User' }
        }
        vi.mocked(api.createPost).mockResolvedValue({ success: true, post: newPost } as any)

        const wrapper = mount(CommunityFeed, {
            global: {
                stubs: {
                    'router-link': true
                }
            }
        })
        await flushPromises()

        // Fill form
        const textarea = wrapper.find('textarea')
        await textarea.setValue('New Post')

        // Submit
        const btn = wrapper.find('button')
        await btn.trigger('click')

        await flushPromises()

        expect(api.createPost).toHaveBeenCalledWith('token', {
            text: 'New Post',
            videoUrl: undefined
        })

        // Check if post is added to list
        expect(wrapper.text()).toContain('New Post')
    })
})
