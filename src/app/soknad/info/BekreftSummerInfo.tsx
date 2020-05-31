import React from 'react';
import InfoMessage from '../../components/info-message/InfoMessage';

const BekreftSummerInfo = () => {
    return (
        <InfoMessage>
            <strong>Du kan kun sende inn søknaden én gang per periode</strong>.<br /> Det vil si at hvis du sender inn
            en søknad med opplysninger som er feil, kan du ikke sende ny søknad eller trekke den søknaden du har sendt.
            <p>
                <strong>Det er derfor viktig at du kontrollerer at tallene du legger inn er riktige.</strong>
            </p>
        </InfoMessage>
    );
};

export default BekreftSummerInfo;
