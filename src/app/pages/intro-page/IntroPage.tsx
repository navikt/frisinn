import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import GlobalRoutes, { getRouteUrl } from '../../config/routeConfig';
import useSøknadsperiode from '../../hooks/useSøknadsperiode';
import InfoOmSøknadOgFrist from '../../soknad/info/InfoOmSøknadOgFrist';
import { relocateToErrorPage, relocateToSoknad } from '../../utils/navigationUtils';
import { erÅpnetForAndregangssøknad } from '../../utils/soknadsperiodeUtils';
import IntroForm from './intro-form/IntroForm';
import IntroCheckList from './IntroCheckList';
import IntroFormInfo from './intro-form/IntroFormInfo';

const bem = bemUtils('introPage');

export interface IntroResultProps {
    canApplyAsSelvstending?: boolean;
    canApplyAsFrilanser?: boolean;
}

const IntroPage: React.StatelessComponent = () => {
    const [introResult, setIntroResult] = useState<IntroResultProps | undefined>();
    const [harSøktFør, setHarIkkeSøktFør] = useState<YesOrNo>(YesOrNo.UNANSWERED);

    const intl = useIntl();
    const currentSøknadsperiodeFetcher = useSøknadsperiode();
    const { søknadsperiode: currentSøknadsperiode } = currentSøknadsperiodeFetcher;

    const hasError =
        currentSøknadsperiodeFetcher.isLoading === false &&
        (currentSøknadsperiodeFetcher === undefined ||
            currentSøknadsperiodeFetcher.søknadsperiode === undefined ||
            currentSøknadsperiodeFetcher?.error !== undefined);

    const includeHarSøktFør = currentSøknadsperiode ? erÅpnetForAndregangssøknad(currentSøknadsperiode) : false;

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
                    isLoading={currentSøknadsperiodeFetcher.isLoading}
                    contentRenderer={() => {
                        if (hasError) {
                            relocateToErrorPage();
                            return null;
                        }
                        if (!currentSøknadsperiode) {
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
                                                inntektstap.
                                            </p>
                                            <p>
                                                Du må søke etterskuddsvis måned for måned. Hvis du har inntektstap i
                                                mai, kan du tidligst søke kompensasjon for denne måneden i begynnelsen
                                                av juni.
                                            </p>
                                            <p>
                                                <Lenke
                                                    href="https://www.nav.no/no/person/innhold-til-person-forside/nyheter/midlertidig-ordning-for-selvstendig-naeringsdrivende-og-frilansere-som-mister-inntekt-pa-grunn-av-koronautbruddet"
                                                    target="_blank">
                                                    Her finner du mer informasjon om ordningen, hvor du også får
                                                    eksempler på hvordan kompensasjonen beregnes.
                                                </Lenke>
                                            </p>
                                        </Normaltekst>
                                    </InformationPoster>
                                </Box>
                                <Box margin="xl">
                                    <InfoOmSøknadOgFrist søknadsperiode={currentSøknadsperiode} />
                                </Box>

                                <Box margin="xl">
                                    <ResponsivePanel>
                                        {includeHarSøktFør && (
                                            <Box padBottom="xl">
                                                <RadioPanelGruppe
                                                    className={'twoColumnPanelGruppe'}
                                                    checked={harSøktFør}
                                                    name="harSøktFør"
                                                    onChange={(_, value: YesOrNo) => {
                                                        setHarIkkeSøktFør(value);
                                                    }}
                                                    legend="Har du søkt om denne kompensasjonen tidligere?"
                                                    description={<IntroFormInfo.infoHarDuSøktTidligere />}
                                                    radios={[
                                                        {
                                                            value: YesOrNo.YES,
                                                            label: 'Ja',
                                                        },
                                                        {
                                                            value: YesOrNo.NO,
                                                            label: 'Nei',
                                                        },
                                                    ]}
                                                />
                                                {harSøktFør === YesOrNo.YES && (
                                                    <Box textAlignCenter={true} margin="xl">
                                                        <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>
                                                            Gå til søknadsskjema
                                                        </Lenke>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                        {(includeHarSøktFør === false || harSøktFør === YesOrNo.NO) && (
                                            <Box>
                                                <Undertittel className="sectionTitle">Sjekk om du kan søke</Undertittel>
                                                <p>
                                                    For å kunne søke kompensasjon for tapt inntekt gjennom denne
                                                    ordningen, må du
                                                </p>
                                                <ul className="infoList">
                                                    <li>være fylt 18 år</li>
                                                    <li>ikke ha fylt 67 år</li>
                                                    <li>
                                                        ha tapt inntekt (ikke tapte oppdrag) som følge av
                                                        koronasituasjonen
                                                    </li>
                                                    <li>
                                                        ikke motta annen utbetaling fra NAV som kompenserer det samme
                                                        inntektstapet
                                                        <ul>
                                                            <li>
                                                                Hvis du er frilanser og mottar dagpenger, eller forskudd
                                                                på dagpenger, kan du ikke søke om denne kompensasjonen
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                                <p>
                                                    Vi vil nå stille deg noen spørsmål som avgjør om du kan søke, og om
                                                    du kan ha rett på denne kompensasjonen.
                                                </p>
                                                <Box padBottom="xl">
                                                    <IntroForm
                                                        onValidSubmit={(values) => setIntroResult(values)}
                                                        soknadsperiode={currentSøknadsperiode}
                                                    />
                                                </Box>
                                            </Box>
                                        )}
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
