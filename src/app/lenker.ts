interface Lenker {
    medlemskap: string;
    personvern: string;
    rettOgPlikt: string;
    saksbehandlingstider: string;
    dittNAV: string;
}

const LenkerBokmål: Lenker = {
    medlemskap:
        'https://www.nav.no/no/Person/Flere+tema/Arbeid+og+opphold+i+Norge/Relatert+informasjon/medlemskap-i-folketrygden',
    personvern:
        'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten/personvernerkl%C3%A6ring-for-arbeids-og-velferdsetaten',
    rettOgPlikt: 'https://nav.no/rettOgPlikt',
    saksbehandlingstider: 'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/Saksbehandlingstider+i+NAV',
    dittNAV: `https://www.nav.no/no/Ditt+NAV`
};

const getLenker = (locale?: string): Lenker => {
    switch (locale) {
        case 'nn':
            return {
                ...LenkerBokmål
            };
        default:
            return LenkerBokmål;
    }
};

export default getLenker;
