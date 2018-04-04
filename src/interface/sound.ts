export interface ISound {
    id: number;
    sound_category_id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    showed_at?: string;
    duration?: number;
    filesize?: number;
    mp3_file?: string;
    pdf_file?: string;
    published_at?: string;
    // data?: {
    //     current_page: number,
    //     total: number,
    //     next_page_url: string
    // };
};