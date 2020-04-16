import React, { useContext, useEffect, useState } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import Lenke from 'nav-frontend-lenker';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import MissingAppContext from '../../components/missing-app-context/MissingAppContext';
import { ApplicationContext } from '../../context/ApplicationContext';
import { AccessCheckResult } from '../../types/AccessCheck';
import { alderAccessCheck, selvstendigAccessCheck } from '../../utils/apiAccessCheck';
import AccessCheckFailedResultList from './AccessCheckFailed';
import EntryForm from './EntryForm';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { ApiKrav, KlientKrav } from '../../types/Krav';
import EndreKontonummer from '../../information/EndreKontonummer';

interface Props {
    onStart: () => void;
}

export interface AccessChecks {
    [ApiKrav.alder]: AccessCheckResult;
    [ApiKrav.selvstendig]: AccessCheckResult;
    [KlientKrav.kontonummer]: AccessCheckResult;
}

interface AccessCheckState {
    pending: boolean;
    complete?: boolean;
    result?: {
        canUseApplication: boolean;
        checks: AccessChecks;
    };
}

const EntryPage = ({ onStart }: Props) => {
    const [accessCheckState, setAccessCheckState] = useState<AccessCheckState>({ pending: true });
    const { pending } = accessCheckState;
    const appContext = useContext(ApplicationContext);

    if (!appContext) {
        return <MissingAppContext />;
    }

    const {
        applicationEssentials: {
            person,
            applicationDateRanges: { applicationDateRange },
        },
    } = appContext;

    async function runAccessChecks() {
        const [alderResult, selvstendigResult] = await Promise.all([
            alderAccessCheck(applicationDateRange).check(),
            selvstendigAccessCheck().check(),
        ]);
        const harKontonummer = person.kontonummer !== null && person.kontonummer !== undefined;
        const kontonummerResult: AccessCheckResult = {
            passes: harKontonummer,
            checkName: KlientKrav.kontonummer,
            info: harKontonummer
                ? `Vi har registrert kontonummeret ${person.kontonummer} på deg`
                : 'Vi har ikke registrert noe kontonummer på deg',
        };
        const canUseApplication = alderResult.passes && kontonummerResult.passes && selvstendigResult.passes;

        setAccessCheckState({
            pending: false,
            complete: true,
            result: {
                canUseApplication,
                checks: {
                    alder: alderResult,
                    kontonummer: kontonummerResult,
                    selvstendig: selvstendigResult,
                },
            },
        });
    }

    useEffect(() => {
        runAccessChecks();
    }, []);

    const { result } = accessCheckState;

    return (
        <Page
            title="Kan du bruke søknaden?"
            topContentRenderer={() => (
                <FrontPageBanner
                    bannerSize="large"
                    counsellorWithSpeechBubbleProps={{
                        strongText: `Hei ${person.fornavn}`,
                        normalText: 'Jeg skal hjelpe deg å sende inn denne søknaden',
                    }}
                />
            )}>
            <Box margin="xxxl">
                <LoadWrapper
                    isLoading={pending}
                    contentRenderer={() => {
                        const { applicationEssentials } = appContext;
                        const harKontonummer =
                            applicationEssentials.person.kontonummer !== undefined &&
                            applicationEssentials.person.kontonummer !== null;

                        if (!harKontonummer) {
                            return (
                                <FormBlock>
                                    <AlertStripeAdvarsel>
                                        <EndreKontonummer />
                                    </AlertStripeAdvarsel>
                                </FormBlock>
                            );
                        }

                        if (result && applicationEssentials) {
                            return (
                                <>
                                    <FormBlock>
                                        <Undertittel>
                                            Kompensasjonsperiode <DateRangeView dateRange={applicationDateRange} />
                                        </Undertittel>
                                    </FormBlock>

                                    {result.canUseApplication && (
                                        <FormBlock>
                                            <EntryForm onStart={onStart} appEssentials={applicationEssentials} />
                                        </FormBlock>
                                    )}

                                    {!result.canUseApplication && (
                                        <>
                                            <FormBlock>
                                                <AccessCheckFailedResultList accessChecks={result.checks} />
                                            </FormBlock>
                                            <FormBlock margin="xl">
                                                <Panel border={true}>
                                                    <Undertittel>Du kan ikke bruke denne søknaden</Undertittel>
                                                    <p>
                                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum ea
                                                        magni id omnis. At, deserunt quae nihil molestias ut aspernatur
                                                        itaque optio corrupti totam. Ducimus ipsa maxime possimus fugit
                                                        eos?
                                                    </p>
                                                    <Box margin="xl">
                                                        <Element>Mer informasjon finner du her:</Element>
                                                        <ul>
                                                            <li style={{ marginBottom: '.5rem' }}>
                                                                <Lenke href="htts://www.nav.no">
                                                                    At deserunt quae nihil
                                                                </Lenke>
                                                            </li>
                                                            <li>
                                                                <Lenke href="htts://www.nav.no">
                                                                    Reprehenderit qui in ea voluptate velit esse quam
                                                                    nihil molestiae consequatur
                                                                </Lenke>
                                                            </li>
                                                        </ul>
                                                    </Box>
                                                </Panel>
                                            </FormBlock>
                                        </>
                                    )}
                                </>
                            );
                        }
                        return <div>Noe gikk galt</div>;
                    }}
                />
            </Box>
        </Page>
    );
};

export default EntryPage;
