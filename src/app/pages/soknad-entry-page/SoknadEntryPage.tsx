import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import Guide from '../../components/guide/Guide';
import EndreKontonummer from '../../information/EndreKontonummer';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import SoknadEntryForm from './SoknadEntryForm';
import { ResetSoknadFunction } from '../../soknad/Soknad';

interface Props {
    soknadEssentials: SoknadEssentials;
    resetSoknad: ResetSoknadFunction;
    onStart: () => void;
}

const SoknadEntryPage = ({
    onStart,
    soknadEssentials: {
        person: { kontonummer },
        personligeForetak,
    },
    resetSoknad,
}: Props) => {
    useEffect(() => {
        resetSoknad(false);
    }, []);

    const harKontonummer = kontonummer !== undefined && kontonummer !== null;

    return (
        <Page
            title="Kan du bruke søknaden?"
            topContentRenderer={() => (
                <StepBanner text="Inntektskompensasjon for selvstendig næringsdrivende og frilansere" />
            )}>
            <Box margin="xxxl">
                <Guide kompakt={true} type="plakat" svg={<VeilederSVG mood="happy" />}>
                    <Box margin="l">
                        <Undertittel>
                            Du kan nå søke om kompensasjon for tapt inntekt som følge av koronautbruddet
                        </Undertittel>
                    </Box>
                    <Box margin="m">
                        <p>
                            Denne søknaden gjelder for deg som helt eller delvis tapt inntekt som selvstendig
                            næringsdrivende og/eller frilanser som følge av koronautbruddet. Kompensasjonen du kan få
                            regnes ut fra tidligere inntekter som du har tatt ut i lønn.
                        </p>
                        <p>
                            Du kan søke om inntektstap som gjelder fra tidligst 16. Mars. De første 16 dagene av
                            inntektstapet må du dekke selv. Det betyr at du tidligst kan få kompensasjon fra 1. april
                            2020.
                        </p>
                        <p>
                            Du må søke etterskuddsvis måned for måned. Inntektstap som gjelder for mai, kan du tidligst
                            sende inn søknad om fra begynnelsen av juni.
                        </p>
                    </Box>
                </Guide>
                {!harKontonummer && (
                    <FormBlock>
                        <AlertStripeAdvarsel>
                            <EndreKontonummer />
                        </AlertStripeAdvarsel>
                    </FormBlock>
                )}
                {harKontonummer && (
                    <FormBlock>
                        <SoknadEntryForm
                            onStart={onStart}
                            kontonummer={kontonummer}
                            isSelvstendig={personligeForetak !== undefined}
                        />
                    </FormBlock>
                )}
            </Box>
        </Page>
    );
};

export default SoknadEntryPage;
