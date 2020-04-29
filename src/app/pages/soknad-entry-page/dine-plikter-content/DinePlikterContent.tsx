import * as React from 'react';
import { useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Systemtittel } from 'nav-frontend-typografi';
import getLenker from 'app/lenker';

const DinePlikterContent: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <>
            <Systemtittel>Mine plikter</Systemtittel>
            <p>Jeg forstår at det kan få konsekvenser hvis jeg</p>
            <ul className="infoList">
                <li>gir uriktig informasjon, eller</li>
                <li>holder tilbake opplysninger</li>
            </ul>
            <p>
                Jeg har lest og forstått det som står på{' '}
                <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                    nav.no/rettogplikt
                </Lenke>
                .
            </p>
        </>
    );
};

export default DinePlikterContent;
