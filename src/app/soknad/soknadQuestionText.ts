import { SoknadFormField } from '../types/SoknadFormData';
import { formatDateRange } from '../utils/dateRangeUtils';
import { DateRange } from '../utils/dateUtils';
import { maxAvsluttetDate, minAvsluttetDate } from './selvstendig-step/avsluttet-selskap/avsluttetSelskapUtils';

export interface SoknadQuestionText {
    [SoknadFormField.selvstendigHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.selvstendigInntektstapStartetDato]: string;
    [SoknadFormField.selvstendigInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.selvstendigHarAvsluttetSelskaper]: (periode?: DateRange) => string;
    [SoknadFormField.selvstendigAlleAvsluttaSelskaperErRegistrert]: (periode?: DateRange) => string;
    [SoknadFormField.selvstendigAvsluttaSelskaper]: (periode?: DateRange) => string;
    [SoknadFormField.selvstendigInntekt2019]: string;
    [SoknadFormField.selvstendigInntekt2020]: string;
    [SoknadFormField.selvstendigErFrilanser]: string;
    [SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigInntektSomFrilanserIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigHarRegnskapsfører]: string;
    [SoknadFormField.selvstendigRegnskapsførerNavn]: string;
    [SoknadFormField.selvstendigRegnskapsførerTelefon]: string;
    [SoknadFormField.selvstendigHarRevisor]: string;
    [SoknadFormField.selvstendigRevisorNavn]: string;
    [SoknadFormField.selvstendigRevisorTelefon]: string;
    [SoknadFormField.selvstendigRevisorNAVKanTaKontakt]: string;
    [SoknadFormField.frilanserHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.frilanserInntektstapStartetDato]: string;
    [SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.frilanserInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserInntektSomSelvstendigIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.arbeidstakerHarHattInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.arbeidstakerInntektIPerioden]: (periode: DateRange) => string;
}

const defaultAvsluttetDateRange: DateRange = {
    from: minAvsluttetDate,
    to: maxAvsluttetDate,
};

const getAvsluttetPeriodeTekst = (periode: DateRange) => {
    return formatDateRange(periode, undefined, true);
};

export const soknadQuestionText: SoknadQuestionText = {
    selvstendigHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}, som følge av koronautbruddet?`,
    selvstendigInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som kompenserer det samme inntektstapet som selvstendig næringsdrivende?',
    selvstendigInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra næring, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigHarAvsluttetSelskaper: (periode: DateRange = defaultAvsluttetDateRange) =>
        `Har du hatt enkeltpersonforetak (ENK, ANS eller DA), som ble avsluttet i ${getAvsluttetPeriodeTekst(
            periode
        )}?`,
    selvstendigAvsluttaSelskaper: (periode: DateRange = defaultAvsluttetDateRange) =>
        `Legg inn selskap som ble avsluttet i ${getAvsluttetPeriodeTekst(periode)}`,
    selvstendigAlleAvsluttaSelskaperErRegistrert: (periode: DateRange = defaultAvsluttetDateRange) =>
        `Har du lagt inn alle selskap som ble avsluttet i ${getAvsluttetPeriodeTekst(periode)}?`,
    selvstendigInntekt2019: 'Hvilken personinntekt fra næring har du totalt tatt ut i 2019?',
    selvstendigInntekt2020: `Hvilken personinntekt fra næring har du totalt tatt ut i januar og februar 2020?`,
    selvstendigErFrilanser: 'Er du frilanser?',
    selvstendigHarHattInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
    selvstendigInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra oppdrag som frilanser, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som frilanser i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigHarRegnskapsfører: 'Har du regnskapsfører?',
    selvstendigRegnskapsførerNavn: 'Navn på regnskapsfører',
    selvstendigRegnskapsførerTelefon: 'Telefonnummer til regnskapsfører',
    selvstendigHarRevisor: 'Har du revisor?',
    selvstendigRevisorNavn: 'Navn på revisor',
    selvstendigRevisorTelefon: 'Telefonnummer til revisor',
    selvstendigRevisorNAVKanTaKontakt: 'Gir du NAV fullmakt til å innhente opplysninger fra revisor?',
    frilanserHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som frilanser i perioden ${formatDateRange(dateRange)}, som følge av koronautbruddet?`,
    frilanserInntektstapStartetDato: 'Når startet inntektstapet ditt som frilanser?',
    frilanserHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som kompenserer det samme inntektstapet som frilanser?',
    frilanserInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra oppdrag som frilanser, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som frilanser i perioden ${formatDateRange(
            dateRange
        )}?`,
    frilanserHarHattInntektSomSelvstendigIPerioden: (dateRange: DateRange) =>
        `Har du hatt noen personinntekt fra næring, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}?`,
    frilanserInntektSomSelvstendigIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra næring, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}`,
    arbeidstakerHarHattInntektIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som arbeidstaker i perioden ${formatDateRange(dateRange)}`,
    arbeidstakerInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt har du hatt som arbeidstaker i perioden ${formatDateRange(dateRange)}`,
};
