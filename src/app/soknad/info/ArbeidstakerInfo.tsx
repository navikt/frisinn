import React from 'react';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import Søknadsperioden from '../../utils/søknadsperioden';
import { DateRange } from '../../utils/dateUtils';

const infoHarHattArbeidstakerinntektIPerioden = () => (
    <ExpandableInfo title="Hva betyr inntekt som arbeidstaker?">
        Du er arbeidstaker når du er ansatt hos en arbeidsgiver, og mottar lønn.
    </ExpandableInfo>
);

const infoOmArbeidstakerinntektIPerioden = ({ søknadsperiode }: { søknadsperiode: DateRange }) => (
    <ExpandableInfo title="Hvilken inntekt skal jeg oppgi her? ">
        Her skal du oppgi pensjonsgivende inntekten du har hatt som arbeidstaker i perioden du søker for. Hvis du har
        jobbet som arbeidstaker for flere arbeidsgivere, oppgir du inntektene samlet.
        <p>
            <strong>Inntekter som skal tas med:</strong>
        </p>
        <ul>
            <li>Inntekt som arbeidstaker</li>
            <li>Feriepenger </li>

            <li>
                Eventuelle utbetalinger du får fra NAV som arbeidstaker (for eksempel sykepenger eller omsorgspenger)
            </li>
        </ul>
        <p>
            <strong>Inntekter som ikke skal tas med:</strong>
        </p>
        <ul>
            {Søknadsperioden(søknadsperiode).erÅpnetForAndregangssøknad && <li>Utbetaling fra denne ordningen</li>}
            <li>Inntekt som frilanser</li>
            <li>Inntekt som selvstendig næringsdrivende </li>
            <li>Uføretrygd</li>
            <li>Alderspensjon</li>
        </ul>
    </ExpandableInfo>
);

const ArbeidstakerInfo = {
    infoHarHattArbeidstakerinntektIPerioden,
    infoOmArbeidstakerinntektIPerioden,
};

export default ArbeidstakerInfo;
