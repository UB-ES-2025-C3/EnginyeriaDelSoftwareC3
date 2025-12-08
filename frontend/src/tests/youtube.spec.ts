import { describe, it, expect } from 'vitest';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '@/utils/youtube';

describe('YouTube Utils', () => {
    describe('getYouTubeVideoId', () => {
        it('extracts ID from standard watch URL', () => {
            const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            expect(getYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
        });

        it('extracts ID from youtu.be short URL', () => {
            const url = 'https://youtu.be/dQw4w9WgXcQ';
            expect(getYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
        });

        it('extracts ID from embed URL', () => {
            const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            expect(getYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
        });

        it('extracts ID from URL with extra parameters', () => {
            const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be';
            expect(getYouTubeVideoId(url)).toBe('dQw4w9WgXcQ');
        });

        it('returns null for invalid YouTube URL', () => {
            const url = 'https://www.youtube.com/watch?v=short'; // ID too short
            expect(getYouTubeVideoId(url)).toBeNull();
        });

        it('returns null for non-YouTube URL', () => {
            const url = 'https://vimeo.com/12345678';
            expect(getYouTubeVideoId(url)).toBeNull();
        });

        it('returns null for empty string', () => {
            expect(getYouTubeVideoId('')).toBeNull();
        });
    });

    describe('getYouTubeEmbedUrl', () => {
        it('generates correct embed URL', () => {
            const videoId = 'dQw4w9WgXcQ';
            expect(getYouTubeEmbedUrl(videoId)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
        });
    });
});
