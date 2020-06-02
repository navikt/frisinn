import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import Guide from '../../components/guide/Guide';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import EndreKontonummer from '../../information/EndreKontonummer';
import { ResetSoknadFunction } from '../../soknad/Soknad';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { createDocumentPageTitle } from '../../utils/documentPageTitle';
import SoknadEntryForm from './SoknadEntryForm';

interface Props {
    soknadEssentials: SoknadEssentials;
    resetSoknad: ResetSoknadFunction;
    onStart: () => void;
}

const SoknadEntryPage = ({
    onStart,
    soknadEssentials: {
        person: { kontonummer },
        isSelvstendigNæringsdrivende,
        søknadsperiode,
        søknadsperiodeinfo: { erÅpnetForAndregangssøknad },
    },
    resetSoknad,
}: Props) => {
    useEffect(() => {
        resetSoknad(false);
    }, []);

    const intl = useIntl();
    const harKontonummer = kontonummer !== undefined && kontonummer !== null;

    return (
        <Page
            title={createDocumentPageTitle('Kan du bruke søknaden?')}
            topContentRenderer={() => <StepBanner text={intl.formatMessage({ id: 'banner.title' })} />}>
            <Box margin="xxxl">
                <Guide kompakt={true} type="plakat" svg={<VeilederSVG mood="happy" />}>
                    <Box margin="l">
                        <Undertittel tag="h1">
                            Du kan nå søke om kompensasjon for tapt inntekt som følge av koronautbruddet, fra og med{' '}
                            <DateRangeView dateRange={søknadsperiode} />
                        </Undertittel>
                    </Box>
                    <Box margin="l"></Box>
                    <Box margin="m">
                        <p>
                            Denne søknaden gjelder for deg som helt eller delvis har tapt inntekt som selvstendig
                            næringsdrivende og/eller frilanser som følge av koronautbruddet.
                        </p>
                        <p>
                            {/* FellesInfoHvaMenesMedTaptInntekt*/}
                            Den tapte inntekten du kan få kompensert, gjelder fra tidspunktet du ikke får inn inntekter
                            du normalt ville fått hvis det ikke var for koronautbruddet. Det gjelder altså den faktiske
                            inntekten du har mistet, og ikke fra når du eventuelt har mistet oppdrag.
                        </p>
                        {erÅpnetForAndregangssøknad && (
                            <p>
                                Du må selv dekke de første 16 dagene av inntektstapet. Dette gjøres kun én gang. Det vil
                                si at om du har fått innvilget kompensasjon gjennom denne ordningen tidligere, og du har
                                dekket de første 16 dagene, skal du ikke gjøre det om igjen nå.
                            </p>
                        )}
                        {erÅpnetForAndregangssøknad === false && (
                            <p>
                                Du kan søke om inntektstap som gjelder fra tidligst 14. mars. De første 16 dagene av
                                inntektstapet må du dekke selv. Det betyr at du tidligst kan få kompensasjon fra 30.
                                mars 2020.
                            </p>
                        )}
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
                            isSelvstendigNæringsdrivende={isSelvstendigNæringsdrivende}
                        />
                    </FormBlock>
                )}
            </Box>
        </Page>
    );
};

export default SoknadEntryPage;
