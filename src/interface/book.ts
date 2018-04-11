export interface IBook {
    id: number;
    book_category_id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    pdf_file?: string;
    image?: string,
    image_thumb?: string,
    image_thumb_square?: string,
    published_at?: string;
};