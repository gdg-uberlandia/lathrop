
/**
 * Um item de schedule pode ter mais de um speech ai utilizamos os dados do speaker para definir a trilha
 * caso não exibimos o próprio topic
 */
const schedule = {
    0: {
        start: '09:00',
        end: '10:00',
        speeches: [{
            topic: 'Abertura'
        }],
    },
    1: {
        start: '10:00',
        end: '11:00',
        speeches: [{
            speakerSlug: 'monica-ribeiro'
        }],
    }
};