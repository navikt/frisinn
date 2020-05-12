import React from 'react';
import InfoMessage from '../../components/info-message/InfoMessage';

const InfoOmSøknadOgFrist = () => (
    <InfoMessage>
        <strong>Du kan kun sende inn søknaden én gang</strong>. Det vil si at hvis du sender inn en søknad med
        opplysninger som er feil, kan du ikke sende ny søknad eller trekke den søknaden du har sendt.
        <p>
            <strong>Det er derfor viktig at du kontrollerer at tallene du legger inn er riktige.</strong>
        </p>
        <p>
            <strong>Søknadsfristen</strong> er innen utgangen av måneden <strong>etter</strong> den måneden du søker
            for. Det vil si at frist for å søke kompensasjon for april, er 31. mai 2020.
        </p>
    </InfoMessage>
);

export default InfoOmSøknadOgFrist;
