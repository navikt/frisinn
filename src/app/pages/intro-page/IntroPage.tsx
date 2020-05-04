import React, { useState, useEffect } from 'react';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useSoknadsperiode from '../../hooks/useSoknadsperiode';
import {
    relocateToSoknad,
    relocateToErrorPage,
    relocateToNoOpenPage as relocateToNotOpenPage,
} from '../../utils/navigationUtils';
import IntroForm from './intro-form/IntroForm';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { Knapp } from 'nav-frontend-knapper';
import IntroCheckList from './IntroCheckList';
import { useIntl } from 'react-intl';
import useTilgjengelig from '../../hooks/useTilgjengelig';
import Lenke from 'nav-frontend-lenker';

const bem = bemUtils('introPage');

export interface IntroResultProps {
    canApplyAsSelvstending?: boolean;
    canApplyAsFrilanser?: boolean;
}

const IntroPage: React.StatelessComponent = () => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const [introResult, setIntroResult] = useState<IntroResultProps | undefined>();

    const intl = useIntl();
    const tilgjengeligFetcher = useTilgjengelig();
    const soknadsperiodeFetcher = useSoknadsperiode(false);

    const { isTilgjengelig } = tilgjengeligFetcher;
    const { soknadsperiode, isLoading: soknadsperiodeIsLoading } = soknadsperiodeFetcher;

    useEffect(() => {
        if (isTilgjengelig) {
            soknadsperiodeFetcher.triggerFetch();
        }
    }, [isTilgjengelig]);

    useEffect(() => {
        if (tilgjengeligFetcher.isLoading === false && soknadsperiodeIsLoading === false) {
            setInitializing(false);
        }
    }, [soknadsperiodeIsLoading]);

    const hasError =
        (soknadsperiode === undefined && tilgjengeligFetcher === undefined) ||
        soknadsperiodeFetcher?.error !== undefined ||
        tilgjengeligFetcher?.error !== undefined;

    const isLoading =
        hasError === false && (initializing || soknadsperiodeFetcher.isLoading || tilgjengeligFetcher.isLoading);

    return (
        <Page
            className={bem.block}
            title={intl.formatMessage({ id: 'banner.title' })}
            topContentRenderer={() => <StepBanner text={intl.formatMessage({ id: 'banner.title' })} />}>
            {introResult ? (
                <Box margin="xxxl">
                    <IntroCheckList {...introResult} />
                    <Box textAlignCenter={true} margin="xl">
                        <Knapp type="hoved" onClick={() => relocateToSoknad()}>
                            Gå til søknaden
                        </Knapp>
                    </Box>
                </Box>
            ) : (
                <LoadWrapper
                    isLoading={isLoading}
                    contentRenderer={() => {
                        if (isTilgjengelig === false) {
                            relocateToNotOpenPage();
                            return null;
                        }
                        if (hasError) {
                            relocateToErrorPage();
                            return null;
                        }
                        if (!soknadsperiode) {
                            return null;
                        }
                        return (
                            <>
                                <Box margin="xxxl">
                                    <InformationPoster>
                                        <Undertittel>
                                            Søknad om kompensasjon for tapt inntekt for selvstendig næringsdrivende
                                            (ENK, DA/ANS) og frilansere
                                        </Undertittel>
                                        <Normaltekst tag="div">
                                            <p>
                                                Dette er en <strong>ny og midlertidig</strong> ordning som er opprettet
                                                som en følge av koronasituasjonen. Den er for deg som er selvstendig
                                                næringsdrivende og/eller frilanser som helt eller delvis har tapt
                                                inntekt på grunn av koronautbruddet.
                                            </p>
                                            <p>
                                                Er du selvstendig næringsdrivende må du enten ha et enkeltpersonforetak
                                                (ENK), et ansvarlig selskap (ANS), eller et ansvarlig selskap med delt
                                                ansvar (DA). Selskapet må være registrert før 1. mars 2020.
                                            </p>
                                            <p>
                                                Er du frilanser må du sjekke om oppdragene dine er registrert som
                                                “Frilanser, oppdragstaker, honorar”. Dette sjekker du på skatteetatens
                                                sider:{' '}
                                                <Lenke
                                                    href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold"
                                                    target="_blank">
                                                    www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/
                                                </Lenke>{' '}
                                            </p>
                                            <p>
                                                Ordningen trådte i kraft 14. mars 2020. I søknaden oppgir du fra når
                                                inntektstapet ditt startet. Du må selv dekke de første 16 dagene med
                                                inntektstap. Det betyr at om inntektstapet ditt startet 14. mars kan du
                                                søke om kompensasjon fra 30. mars 2020.
                                            </p>
                                            <p>
                                                Du må søke etterskuddsvis måned for måned. Hvis du har inntektstap i
                                                mai, kan du tidligst søke kompensasjon for denne måneden i begynnelsen
                                                av juni.
                                            </p>
                                        </Normaltekst>
                                    </InformationPoster>
                                </Box>
                                <Box margin="xl">
                                    <ResponsivePanel>
                                        <Undertittel className="sectionTitle">Sjekk om du kan søke</Undertittel>
                                        <p>
                                            For å kunne søke kompensasjon for tapt inntekt gjennom denne ordningen, må
                                            du
                                        </p>
                                        <ul className="infoList">
                                            <li>være fylt 18 år</li>
                                            <li>ikke ha fylt 67 år</li>
                                            <li>ha tapt inntekt (ikke tapte oppdrag) som følge av koronasituasjonen</li>
                                            <li>
                                                ikke motta annen utbetaling fra NAV som kompenserer det samme
                                                inntektstapet
                                                <ul>
                                                    <li>
                                                        Hvis du er frilanser og mottar dagpenger, eller forskudd på
                                                        dagpenger, kan du ikke søke om denne kompensasjonen
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <p>
                                            Vi vil nå stille deg noen spørsmål som avgjør om du kan søke, og om du kan
                                            ha rett på denne kompensasjonen.
                                        </p>
                                        <Box padBottom="xl">
                                            <IntroForm
                                                onValidSubmit={(values) => setIntroResult(values)}
                                                soknadsperiode={soknadsperiode}
                                            />
                                        </Box>
                                    </ResponsivePanel>
                                </Box>
                            </>
                        );
                    }}
                />
            )}
        </Page>
    );
};

export default IntroPage;
