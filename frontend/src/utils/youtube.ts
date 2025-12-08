/**
 * Extracts the YouTube video ID from a given URL.
 * Supports formats:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * 
 * @param url The URL to parse
 * @returns The video ID or null if not found/invalid
 */
export function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Regex to capture video ID from various YouTube URL formats
    // 1. youtube.com/watch?v=...
    // 2. youtu.be/...
    // 3. youtube.com/embed/...
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Generates the embed URL for a YouTube video ID.
 * 
 * @param videoId The YouTube video ID
 * @returns The embed URL (https://www.youtube.com/embed/VIDEO_ID)
 */
export function getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
}
