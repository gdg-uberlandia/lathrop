import { BannerItem } from "@/components/devfest-triangulo-2025/InfiniteBanner";

const googlePhotos2023Urls: string[] = [
  "https://lh3.googleusercontent.com/pw/AP1GczNKpy8R0iPsEIbAheGeEbY8eSdEJWXNbTLsKJ9zcHuQTuxL3dk_O0A_umszjsRJ9Wo0QCe8rQBE1HXZDqxnFDhmIIwi4mxj0m4ZfgpgO4A3P-D8oZRtFirW5v_RNeHWkgoV5M5S_Yb5gegI3U23FJPO=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNCTPituzhE68uBvIZBOnbKKJQE_AZJ5GgYwERQ632hed-Gw4VyMLo3RdiFKcvLK04uw9fx8BV4VjpLG1gTx4Ik5_irOox_boknETN95ngyZyoVb0C77t4S61qZCPmv9L263OTvxJ6wpC5YFxxnQhLT=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNEnTyZzZiJleLXgz2TifjQe6yifuQPz1mdaNhh77vvj0DqSuSJt0z80ryr1g7fFOW3PUfTi7Pxv5q8Smd9h4JFicydc30cY13pPcsOL3CTZHze7wPVDZtvXEjaH2dJ83yORTHgDKsAdoEylWoFtica=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP5Gk6gbv7gr0yAswqOtU02E2HxWomm5QPTM_-Zqeec2PmOx-14YdB0ZbJWistIjsr56FPF4E5OIlniEl_8hu9ZStzKa3lMnyFqNgkDDHNGUAWLdT57N0IXX5H4z2Yamc05QpTpocNHM7iXKujxY95V=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP6clRvma0Ee48zM233zvZdCCtxLzEI1rxcgvmyDe3ggNMAfPl7Ur0rttnCz8j2ZaGAfwmj8WS3g1dyV_WeEuP0d2PeBEz0pH1LxeZR2doqlRnZyefGv15IZyj0ZTydqpNY_Ge-e_R9hQcwaInOhz8n=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNG4vfaUCCsLq3yhwQR_dOSsLNO8X8Tc1V8W72ayMrtv5oaq-GUDrAMTf_oZFtKhzviBFuJFaQnD6twTzRpHU-h00H8kmf00HFIpJ-Qyxqrzghru8DrkJrFFE0w3JJSNJDET2Jy92ewk3pRw1yZsBOB=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOKrKtU7VdEVSEAL5xeetr-flMsgUOmgThikQBPjYqXl7JxsQVXNg6RL15rq3eJWM-N7GGH2SRI-a_92R3hD76iVoFzCLDx6o5TlTDF7ym3ZQrC7w-RkI4IXVZmIkxM_NDPlZ8R8OjzYflP-TZrxGx9=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO5NtFNulJo_u4B2vHfEws6xXPT0LNf1C_gN62S_rBOqCM9J5zJSpSdsK8Mf9xsW20S8Twzrkx8EwMae9brAHwf1X2uAbrj5_JBeOiYhhqcnSDiJH28enjTgH62DR9N4IBWARBari7NGMYrrnDHFDy6=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMSR3zzO29srE-OcdKRm2r9nR3Wb86b5KRS0FHQbdfGfX5SaEN0zBuq-ajEuqS4N1AzcqrJ9Xfa3NbrDI_2YORKIP05ea-qY9-3I2yM6ZxOmpZsM8GoL-K_747svcSsUFGRH3Or37r5LVqGqZcfEmP9=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPMIQea3pky500SwZt4SUh4ZaS_RLlPxgj0aEzjIXzjxG1gc3sFrSyTczdAMKfvo3SIjzWQ_QzAfOKsKUpF_KnpM1974F7By8sCgsC42-8bz-xG0DodbALLhWExIhqe-BCdaXwm1U-I5L71RpmaSqIz=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN_2Rf_7UK6Myu14EqnwI76-8Zt69-nrO_CKCw49JCCLcp5OJJUqmfRP2d-aRCygVI5Rkg-Ll-bo2eVfVv-4w8Ewusl4JapLE53OuHuYUe8jGfEilCZh7xcMx3Cg60i6cWiJRAy5_MOqzj6EtaM8kLS=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMxDYUM3Q9_hbtyPEn3j92lLQJNlaUlksi0VcGrjxaYPrKOq48mUtdUbcGjZaL7XqcWmtj0pFgm5CXpuailEopk4BuHIdzItgyggNdpz8I5QZ0uyvhlZAhyfpY47J-QpJ-H4i3lDJfIVuwr2yaE3dza=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNsChaPG4thQ6u8inmZY75OTh9DZqEVCqHackirCPMldk06Wg2_u_zyhq450FapUDWLGqbPqiEgG1syUqRiwXHqjC4xl8VJWIb3AVEM0wwhAUOjTh9Mi08hCOXJ0-zTpTZzsiPrQ7Rn1gVK4sVy-lMY=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMxVkzV8AZ3OG2VBhUMw8LZfgERncmyt8uAh1Auch9aN9xygLHmPYfYckJv0yc7jLOe6-8wqGtfNCJk8l3evymX0GbzYz834m74-JkLk5-5lq8MJrz3IlTnIL-GP-pmPv-EGTIlZ_RnqvjsfqEPndZA=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP-rzPznCfwY93PixQ2HDTGq8wTqid5CcchhPKEDcHtQSYsKGtNN_5cNfLqjT0ygsLkkQj3hqbUFxHatQJLodMVvJoRwzV-_DUeSFUC37znYn1pAfB0wx4VUHbsOgwj8u3WXCKT_c0peEEhMz0xfmvh=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOd43wmcBOxSxDjCdnYkHnsrxyAA4-rozTta3fm1fHfYTwmMFfnbQGsJZ4hz_eU4XwGA5zfS5DYnbcj59wjpBcfM60PEPLVEujDvAWkFdf-EobrxYc-kqEzHvb_BUk9AY60xRm15xNC5YMLWTTNALUX=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOyVEGwMPHt4eLWk8pZqrcvoRXY75MhMy1bHgGYOb_xj0ugqeDgHlxmtm73DR0PCv1YaOSIJJLwquTJX8xeaItFD894ijMpK6yohLK7R2mtpOM46Y4Ik7SQZ4LZ9Wtq17hDJZ9epPGT0GUcgDb63dNZ=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPmq0eI8evTv8n15VCvrNkVlL2oF0vcDbgrBGp8Kssv2DlroldUx7QgaK9PGeVlfjvmXF5-H91QyWuCX_HwBDBP_wpRva50tsRY0pLa26TQV9hHcfxDs0600K2eCKfDDeNssJ5tLyV5i5l88t4kOWv2=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPp0BapmCIcGSJo_1aQIgj2Xuk_m8iXWJAqHeH2kjAmj86Ji329bzqcZzaBqyeD9W9fZWQjFO_w08FbCAyWDIHx7xgc03EJVdfTx7pMEkyC8yzyiYvt7wf2bJD5oxq43zfzrtbke8s0pAfT2rReqBcA=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPx7UCbyCfkGqrUNSaK8pSIykPFN95-l1nTNqMfmVJIUsPPZm6lw43S1Mo5LgllExvAl1bvy0iYvTjXeoJ5VAgeXGRBFJKSk_RkT_7z7rOyh-fUt2wycHKwn_2VEZk0efEWyHWJ4oHtgV3LkEv0NsEc=w1078-h719-s-no-gm?authuser=0",
];

const googlePhotos2024Urls: string[] = [
  "https://lh3.googleusercontent.com/pw/AP1GczNPDbPMPz5uEW2GQHmKEIBlE_9ZyCzEapMaIvT2RqL5nOxYr2pkB4IiONEpreODPsJAmKB-aEFjFDx2tHdB6JDOp9iMh9DcUI_tqIUeWeBueHF9ElbHwTAFwaHNL1u1ddby35Y3dv_N--5PEiPhLiXI=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNZr4EhwlZ0i-q_4i-fyz8DYD9U0zGSkdIKGLZy9oBAXIU9j0QR26ZYuzfr9WefpvwYqG1d5DMjN0zl-YdOrOhcEIypJW_MCwj2rqLQZAyuHYd2jt2fH_VjzEXZXxmKMxkgyIfmkf-PEui-UiNEBgar=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNjC-pVBiCs_JuoRElOtZWiVzTDN7Mh-fH5Mi5G1wZmnAM9Euokss2P2HGsnf4rdYuLyyGxUVRM3oB5LcM3Udbkx5kYwke_0EGWJsGnlB2izSiXVv4unl3Y3NMH9jKVfYoEhpKGd9pcEW2qGJf8tZrN=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNh3AwTf5UNWAQRfHojxD08d9YIxXIWiYFYOS99lH5cRyQ0pbVhKINWW6Hdg9DvCO0BXBJ79slivkL7opTUWvhg00tbHp7R09Mf4zvGsXHGwz6ylpLbhwDKFyAPuayuJ_C-nzHIZxFDDPrv9Cw_x8o1=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNHSas_P36_oxT9tFMITjMTz55CBquFW-ZdtT_jd8ONoVz83bmSOQ7_wEnk4Yr04QCvva9xbUK12jsoks2kUucwdH7_xWbflPUoVsQCqOS5AsSqzYglZrN9fxjWLR6tECoz_9eaVvi7eaHzkTrqRKLR=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOr_RaZcPQsIjEId_O7exOEvZMBjMSMpiBaR6vBU4k_-ap3FTZRbYR-A4E9KPOwtdWgthq-dP6NfM-h3ra5O7t0At8zMMOHcTgB3CUc_jN6ss3xLXOhNGkygSEvSrJiS-ompqG2TCI5XRGyReq7XJp1=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMHAtp4OcaNWzIjWvFzzzlDjdhj4wbGpTeoGx8BvOLeWzrZKaXbs2pQxJ9Wnl1T4b7j9sKBGFCkpAx0KEkFrKzcoBFtIwKbhjkJCIhTXi_6IwOvJlqE2025sitz9QFGVDe1FwhUt4e-O_sXFyizEifb=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPoqEaONldTyfOJ6W8bJRCGhoiMw3c-VVq1ATtji7umW22MSp8rqCrUCTHNssa6M3_7kbtjf-9OjQc8_MR3Pr-V9XJzWmZOcpUEX89NMfM3qpCTBx_KlmQw3Pc8FlgjuJxcd69_-zF0oXCc_4iihcpW=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNCWnCyfrkTj5v5QXovpsAJPA6CdZWr_WqokiejC-SGN9ccYiylqik-tsbNRjrS-Pn_suFWaM3gj-KIDy3pJ6XqmRMq43TMOuB9BT698FmumaXU6VFbnV7m2N3he7zzi6W105JWSvrxrpk7i6wcHLoA=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPLkfRhxRqCuxYwmXcS3oBY62mA1ghjS-KU3xC5Niq9eLt4BhqAzpH4hJYdag4decJfxSnxTgECGTwi2_VFUB6JY0FlYq8LcOX3HkKMuWjA3btNXMzEKbxpU5fRwnU-x0X7567F6_EKzRoy_x3LF8nh=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNHj_C04QVO5so9JckdcGy72yQanedXcR9e7U7Awriy2mfcxeS8Y7pdtGbl4YWNiHP94L6V0P1943DCuW-aaFBKDPKf0bZdoIw1MNS_zx61aaX8mSJXhcFY4053DaGMUdNSAp4HW9I69jG3jHj2WFuK=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPj-RZHZK4iN0G3AR_OrAMlJoAvwxBKkaa27BwgHR6_1xxzpMonE79WvBHU9b-tj66EhRDOHFi8Tpd3n9WFn5e7CI5O0uJgjLDGlzRY3fPsIMknD51lCh7ZplV6KwX_-7NUxdI6aQVEjJZvr1f2a2_e=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM_bLZNQUv5fn3ORNJkuD_SxWQjHp3Cv7kHAL9XOo4AvSiKXU4ZFPuq9hQ3IABf3s_4-pnfRf7LYVHBAV9Bk-CzEem0gfISxspplvCl8vFrkxXjDNTRTagNhrB5GeRGfsYRbHtN5g6N6UItsFjM7wrr=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOmWMd8V6917_XpPLbz_EYzLW8fHu_2y1Y-9k77kkaHT2VC-Tl6YJUqMjtom0P7u1rwr_dQKWMS9Q6xX-gS8jyp-0Pq7Hxr7hISS20cJL1mYdvPUHRIHgffXU50v-mBWSZFuE69B1kEHlVGdVN8vK66=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPBtcKFL4_JmgWxTRIxDTpamQFwM2yB5WpHp92rDJEz2e8hb_6OuqXK6FSKFGupP9lFFmcogW8J9ILqfJGCSel3ol8WD9xbc4pR1Z9SJdjcpov1w5_XBkTsPpYh5iJTvsYcBmyiFolXmHRIcVHDvn5S=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN2srI75i5xaCtKoTde4oTyBXkB5pvfm-1sG6gVUddeKGtx52CPSOxBMgBZCg9jsA6ovj542dF2VLjUh4vG_PUeZUOgIX-GfbL31biW8G6_xc7MwHPh0GXjOQpDGrkTNx7IYg52AYgAnJwovxMHOOFb=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczORs2tdZH1PbGBUFPu9z-h1odlys0FI5RtReUjFTlP0AmpiYGnS2UKXDMKcybbFOkQh4qLtuyTwxZMM-RRf9wmvv38MNoFWgbN08NYMtOcanExTx-zJifLoqxniKgg2NqRZnuYNZ0piUCBDcWPMKuwO=w1078-h719-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPbfZEzcu6Zb56CGruwXCvzzTnkLGrGXlNpkspycliqok0l0m20ie_yUT3JYXkFuk8kAYFvAnN3lDIMn_stgFJ0ZE7I7R2sgdj9OkJufnWyIDX000svbHmGDygusf_GdCOv8vQw11kir3I1PBzb_Fbv=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNDEWtLAkcdEYVSsWaxvtEW8U2dKpzIxE6e3BitDGmRO5rbuobkssHmb--ySRkSMzT1UviVPBplfPuzVL_YvQ2N3ArF03fIJMKtnH8UXzn2JNG-cixqpt6rAzZZ7YoVu5z0oiV_LrC_kpzpP9R2JIy_=w1078-h717-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMLeSYsZbMjlsV_uzlXtap1nCDUV-VwbSM8uWiIW1ur3smY7JBv_53VRBeH804aLcbaVa3G3gYqy3Bz9ESIh2HxOnnSbrwKumvNxutvPQccRp4-G7XpWfB2_sS1LStK9wU_ga3PRWGfMrATEjKduoKY=w1078-h719-s-no-gm?authuser=0",
];

export const devfest2023Images: BannerItem[] = googlePhotos2023Urls.map(
  (url) => ({
    type: "image",
    src: url,
  }),
);

export const devfest2024Images: BannerItem[] = googlePhotos2024Urls.map(
  (url) => ({
    type: "image",
    src: url,
  }),
);
