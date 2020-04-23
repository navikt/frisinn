import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import AppVeilederSVG from '../../components/app-veileder-svg/AppVeilederSVG';
import Guide from '../../components/guide/Guide';
import EndreKontonummer from '../../information/EndreKontonummer';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData } from '../../types/SoknadFormData';
import EntryForm from './EntryForm';
import { isFeatureEnabled, Feature } from '../../utils/featureToggleUtils';
import soknadTempStorage from '../../soknad/SoknadTempStorage';

interface Props {
    soknadEssentials: SoknadEssentials;
    onStart: () => void;
}

const EntryPage = ({
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
                <Guide kompakt={true} type="plakat" svg={<AppVeilederSVG mood="happy" />}>
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
                        <EntryForm
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

export default EntryPage;
