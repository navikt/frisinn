import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import { Foretak } from '../../types/SoknadEssentials';
import { pluralize } from '../../utils/pluralize';

const intro = ({ antallForetak, foretak }: { antallForetak: number; foretak: Foretak[] }) => (
    <>
        <p>
            Vi har funnet {antallForetak} foretak registrert på deg som du kan søke om tapt inntekt for. Informasjonen
            du oppgir på denne siden skal gjelde for alle foretakene dine samlet.
        </p>
        <ExpandableInfo closeTitle={'Skjul liste'} title={'Vis foretak vi har registrert'}>
            <ForetakList foretak={foretak} />
        </ExpandableInfo>
    </>
);

const advarselForSentInntektstap = () => (
    <>
        Du kan ikke søke for denne perioden fordi du får dekket først fra og med den 17. dagen etter inntektsstapet
        startet.
    </>
);

const advarselIkkeTapPgaKorona = () => <>Du kan ikke søke om kompensasjon for tap som ikke er forårsaket av Korona</>;

const advarselAlderSjekkFeiler = () => (
    <>
        <Element>Du kan ikke søke som selvstendig næringsdrivende for denne perioden</Element>
        <p style={{ marginTop: '.5rem' }}>Kravet er at du må være mellom 18 og 67 år i perioden du søker for.</p>
    </>
);

const ytelseDekkerHeleTapet = () => (
    <>Når du har en annen NAV ytelse som dekker hele tapet, kan du ikke søke på denne ytelsen</>
);

const infoInntektForetak = () => (
    <ExpandableInfo title="Hvordan beregner du inntekt?">
        <Box margin="l">
            <Element>Inntekter som skal tas med:</Element>
            <ul>
                <li>Inntektene du har på dine foretak. Dette er omsetning - utgifter</li>
                <li>Inntekter som er utbetalinger fra NAV som selvstendig næringsdrivende</li>
            </ul>
            <Element>Inntekter som IKKE skal tas med:</Element>
            <ul>
                <li>Eventuell uføretrygd</li>
                <li>Eventuell alderspensjon</li>
                <li>Eventuell inntekt som frilanser</li>
            </ul>
        </Box>
    </ExpandableInfo>
);

const advarselIkkeHattInntektFraForetak = ({ inntektÅrstall: årstall }: { inntektÅrstall: number }) => (
    <>
        <Element>Du kan ikke søke som selvstendig næringsdrivende for denne perioden</Element>
        <>Du må ha hatt inntekt i {årstall} for å kunne søke på denne ytelsen.</>
    </>
);

const infoInntektÅrstall = ({ foretak, inntektÅrstall }: { foretak: Foretak[]; inntektÅrstall: number }) => (
    <>
        <ExpandableInfo title={`Hvorfor inntekt i ${inntektÅrstall}?`}>
            Dette er basert på hvilket år {pluralize(foretak.length, 'foretaket ditt', 'ditt eldste for')} ble
            registrert. For å kunne søke på denne ytelsen må du ha hatt inntekt fra foretaket. Dersom du har foretak som
            er registrert i 2019 eller tidligere, må du ha hatt inntekt i 2019. Dersom foretaket ditt er registrert i
            2020, må du ha hatt inntekt fra det i 2020.
        </ExpandableInfo>
    </>
);

const SelvstendigInfo = {
    intro,
    infoInntektForetak,
    advarselForSentInntektstap,
    advarselIkkeTapPgaKorona,
    advarselAlderSjekkFeiler,
    ytelseDekkerHeleTapet,
    advarselIkkeHattInntektFraForetak,
    infoInntektÅrstall,
};

export default SelvstendigInfo;
