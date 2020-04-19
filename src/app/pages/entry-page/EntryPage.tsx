import React, { useContext } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import { Undertittel } from 'nav-frontend-typografi';
import MissingAppContext from '../../components/missing-app-context/MissingAppContext';
import { ApplicationContext } from '../../context/ApplicationContext';
import { AccessCheckResult } from '../../types/AccessCheck';
import EntryForm from './EntryForm';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { ApiKrav, KlientKrav } from '../../types/Krav';
import EndreKontonummer from '../../information/EndreKontonummer';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import Veilederpanel from 'nav-frontend-veilederpanel';
import AppVeileder from '../../components/app-veileder/AppVeileder';

interface Props {
    onStart: () => void;
}

export interface AccessChecks {
    [ApiKrav.alder]: AccessCheckResult;
    [ApiKrav.selvstendig]: AccessCheckResult;
    [KlientKrav.kontonummer]: AccessCheckResult;
}

const EntryPage = ({ onStart }: Props) => {
    const appContext = useContext(ApplicationContext);
    if (!appContext) {
        return <MissingAppContext />;
    }
    const {
        applicationEssentials: {
            person: { kontonummer },
            personligeForetak,
        },
    } = appContext;

    const harKontonummer = kontonummer !== undefined && kontonummer !== null;

    return (
        <Page
            title="Kan du bruke søknaden?"
            topContentRenderer={() => (
                <StepBanner text="Inntektskompensasjon for selvstendig næringsdrivende og frilansere" />
            )}>
            <Box margin="xxxl">
                <Veilederpanel
                    kompakt={true}
                    type="plakat"
                    veilederProps={{ transparent: false, fargetema: 'normal' }}
                    svg={<AppVeileder mood="happy" />}>
                    <Box margin="l">
                        <Undertittel>Kompensasjon for inntektsstap i april 2020</Undertittel>
                    </Box>
                    <Box margin="m">
                        Du kan ha rett på dette dersom du har tapt inntekt som selvstendig næringsdrivende eller
                        frilanser denne perioden.
                    </Box>
                </Veilederpanel>
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
