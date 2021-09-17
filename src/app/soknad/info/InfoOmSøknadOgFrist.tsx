import React from 'react';
import moment from 'moment';
import InfoMessage from '../../components/info-message/InfoMessage';
import DateView from '../../components/date-view/DateView';
import { DateRange, getSøknadsfristForPeriode, getMonthName } from '../../utils/dateUtils';

const InfoOmSøknadOgFrist = ({
    søknadsperiode,
    erISisteSøknadsperiode,
}: {
    søknadsperiode: DateRange;
    erISisteSøknadsperiode: boolean;
}) => {
    const frist = getSøknadsfristForPeriode(søknadsperiode);
    const åpningNestePeriode = moment(frist).add(1, 'day').toDate();
    const mndDennePerioden = getMonthName(søknadsperiode.to);
    const mndNestePeriode = getMonthName(moment(søknadsperiode.to).add(1, 'month').toDate());

    return (
        <InfoMessage>
            <strong>Du kan nå søke om kompensasjon for inntektstap i {getMonthName(søknadsperiode.to)}.</strong>
            <p>
                <strong>
                    Søknadsfristen for {mndDennePerioden} er <DateView date={frist} format="dateAndMonthAndYear" />
                </strong>
                . Fra <DateView date={åpningNestePeriode} format="dateAndMonth" /> åpnes det for å søke om kompensasjon
                for tapt inntekt i {mndNestePeriode}.
                <br />
                {erISisteSøknadsperiode ? (
                    <>Det blir den siste måneden det er mulig å søke kompensasjon gjennom denne ordningen.</>
                ) : (
                    <>Du må søke etterskuddsvis måned for måned.</>
                )}
            </p>
            <p>
                <strong>Du kan kun sende inn søknaden én gang per periode</strong>.<br /> Det vil si at hvis du sender
                inn en søknad med opplysninger som er feil, kan du ikke sende ny søknad eller trekke den søknaden du har
                sendt.
            </p>
        </InfoMessage>
    );
};

export default InfoOmSøknadOgFrist;
