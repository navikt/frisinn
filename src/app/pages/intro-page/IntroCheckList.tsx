import React from 'react';
import Lenke from 'nav-frontend-lenker';
import Guide from '../../components/guide/Guide';
import { Undertittel } from 'nav-frontend-typografi';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';

interface Props {
    canApplyAsSelvstending?: boolean;
    canApplyAsFrilanser?: boolean;
}
const IntroCheckList = ({ canApplyAsSelvstending, canApplyAsFrilanser }: Props) => {
    const canApplyAs = [
        ...(canApplyAsSelvstending ? ['selvstendig næringsdrivende'] : []),
        ...(canApplyAsFrilanser ? ['frilanser'] : []),
    ];

    return (
        <>
            <Guide svg={<VeilederSVG mood={'happy'} />} kompakt={true} type="plakat">
                <Undertittel>Viktig informasjon når du skal søke som {canApplyAs.join(' og ')}</Undertittel>
                <p style={{ marginTop: '.5rem' }}>
                    Midlertidig tekst. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ut, sit libero
                    earum quaerat cumque deleniti. Eveniet, quos sed pariatur architecto atque quidem nam adipisci
                    maxime, laborum, quis corporis enim?
                </p>
                <ul className="checklist">
                    <li>
                        Nå går du videre i prosessen til utfyllingen av selve søknaden om kompensasjon for tapt inntekt
                        som følge av koronautbruddet.
                    </li>
                    <li>
                        Du trenger bank-id for å logge deg inn i søknaden.{' '}
                        <Lenke href="https://www.norge.no/elektronisk-id" target="_blank">
                            Slik skaffer du bank-id.
                        </Lenke>
                    </li>
                    <li>
                        Du vil måtte svare på noen av de samme spørsmålene som ovenfor når du har logget deg inn. En del
                        opplysninger henter vi fra offentlige registre, mens noen opplysninger må du skrive inn på nytt.
                    </li>
                    <li>
                        Du er selv ansvarlig for å gi oss riktige opplysninger. Vi kontrollerer opplysningene du gir.
                    </li>
                    <li>
                        Du vil måtte svare på noen av de samme spørsmålene som ovenfor når du har logget deg inn. En del
                        opplysninger henter vi fra offentlige registre, mens noen opplysninger må du skrive inn på nytt.
                    </li>
                    <li>
                        Du er selv ansvarlig for å gi oss riktige opplysninger. Vi kontrollerer opplysningene du gir.
                    </li>
                </ul>
            </Guide>
        </>
    );
};

export default IntroCheckList;
