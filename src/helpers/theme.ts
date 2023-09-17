export interface ThemeValues {
    bgImageFull: string; // path image
    bgImageFullPosition?: string;
    bgImageFullSize?: string;
}



const Theme: ThemeValues = {
    bgImageFull: '/header.jpg',
    bgImageFullPosition: 'center top',
    bgImageFullSize: 'cover',
}
export default Theme