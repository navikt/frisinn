import React from 'react';
import InfoMessage from '../../components/info-message/InfoMessage';
import { DateRange, getSøknadsfristForPeriode, getMonthName } from '../../utils/dateUtils';
import DateView from '../../components/date-view/DateView';

const InfoOmSøknadOgFrist = ({ søknadsperiode }: { søknadsperiode: DateRange }) => {
    const frist = getSøknadsfristForPeriode(søknadsperiode);
    const forlengetFristApril = true;
    return (
        <InfoMessage>
            <strong>Du kan kun sende inn søknaden én gang per periode</strong>. Det vil si at hvis du sender inn en
            søknad med opplysninger som er feil, kan du ikke sende ny søknad eller trekke den søknaden du har sendt.
            <p
                style={{
                    fontSize: '1.1rem',
                    margin: '0 0 1.5rem 0',
                    padding: '1.25rem 0 .75rem 0',
                    borderBottom: '1px solid #5690a2',
                }}>
                <strong>Det er derfor viktig at du kontrollerer at tallene du legger inn er riktige.</strong>
            </p>
            {forlengetFristApril === true && (
                <p>
                    <strong>Søknadsfristen</strong> for april er 3. juni. Fra 4. juni åpnes det for å søke om
                    kompensasjon for tapt inntekt i mai.
                </p>
            )}
            {!forlengetFristApril && (
                <p>
                    <strong>Søknadsfristen</strong> er innen utgangen av måneden <strong>etter</strong> den måneden du
                    søker for. Det vil si at frist for å søke kompensasjon for {getMonthName(søknadsperiode.to)}, er{' '}
                    <DateView date={frist} />.
                </p>
            )}
        </InfoMessage>
    );
};

export default InfoOmSøknadOgFrist;
