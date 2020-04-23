import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import Guide from '../../components/guide/Guide';
import EndreKontonummer from '../../information/EndreKontonummer';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData } from '../../types/SoknadFormData';
import SoknadEntryForm from './SoknadEntryForm';
import { isFeatureEnabled, Feature } from '../../utils/featureToggleUtils';
import soknadTempStorage from '../../soknad/SoknadTempStorage';

interface Props {
    soknadEssentials: SoknadEssentials;
    onStart: () => void;
}

const SoknadEntryPage = ({
    onStart,
    soknadEssentials: {
        person: { kontonummer },
        personligeForetak,
    },
}: Props) => {
    const { resetForm } = useFormikContext<SoknadFormData>();

    useEffect(() => {
        resetForm();
        // Todo - denne logikken virker ikke med reell mellomlagring, da bruker skal bli sendt til riktig steg
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            soknadTempStorage.purge();
        }
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
                        <Undertittel>Kompensasjon for inntektsstap i april 2020</Undertittel>
                    </Box>
                    <Box margin="m">
                        Du kan ha rett på dette dersom du har tapt inntekt som selvstendig næringsdrivende eller
                        frilanser denne perioden.
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
