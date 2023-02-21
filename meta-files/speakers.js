/***
 * Os ids dos palestrantes são gerados automaticamente
 *
 * companyTile: Utilizado para expressar qual o cargo atual
 * slug: nome encurtado em camel case para ser utilizado na grade
 * path: nome da trilha que irá apresentar
 * photo: url da foto no firestore
 * tech: tecnologia principal, ou tópico da palestra
 * title: Titulo //Utilizamos caso seja GDE, MVP...
 * miniBio: Biografia
 * topic: titulo da Palestra
 * content: texto curto sobre a palestra
 * socials: [{url: "" , type: "linkedin|instagram" }
 */

const spaker = {
    "company": "",
    "companyTile": "",
    "community": "",
    "title": "",
    "name": "",
    "slug": "",
    "photo": "",
    "path": "",
    "tech": "",
    "topic": "",
    "miniBio": "",
    "socials": []
};