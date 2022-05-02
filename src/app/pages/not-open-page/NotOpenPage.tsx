import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Ingress, Undertittel } from 'nav-frontend-typografi';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import ErrorPage from '../../components/error-page/ErrorPage';

const isClosed = true;

const NotOpenPage: React.StatelessComponent<{}> = () => {
    return (
        <ErrorPage pageTitle="Søknaden er nå ikke tilgjengelig">
            {isClosed ? (
                <InformationPoster>
                    <Undertittel>
                        Søknad om kompensasjon for tapt inntekt for selvstendig næringsdrivende (ENK, DA/ANS) og
                        frilansere
                    </Undertittel>

                    <Box margin="xl" padBottom="l">
                        <AlertStripeInfo>
                            <strong>Ordningen opphørte 31. mars 2022</strong>
                            <br /> Det betyr at det nå ikke lenger er mulig å søke kompensasjon gjennom denne ordningen.
                        </AlertStripeInfo>
                    </Box>
                </InformationPoster>
            ) : (
                <ErrorGuide title="Søknaden er dessverre ikke tilgjengelig" stillHappy={false}>
                    <Ingress tag="div">Vi jobber så raskt vi kan med å få den tilgjengelig.</Ingress>
                </ErrorGuide>
            )}
        </ErrorPage>
    );
};

export default NotOpenPage;
