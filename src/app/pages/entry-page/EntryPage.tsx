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
import { alderAccessCheck, frilanserAccessCheck, selvstendigAccessCheck } from '../../utils/apiAccessCheck';
import AccessCheckResultList from './AccessCheckResultList';
import ConfirmationForm from './ConfirmationForm';
import { ApplicantProfile } from '../../types/ApplicantProfile';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    onStart: () => void;
}

export interface AccessChecks {
    alder: AccessCheckResult;
    frilanser: AccessCheckResult;
    selvstendig: AccessCheckResult;
}

interface AccessCheckState {
    pending: boolean;
    complete?: boolean;
    result?: {
        canUseApplication: boolean;
        checks: AccessChecks;
        profile: ApplicantProfile;
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
            applicationDateRanges: { applicationDateRange, frilansDateRange, selvstendigDateRange },
            companies,
        },
    } = appContext;

    async function runChecks() {
        const [alderResult, selvstendigResult, frilanserResult] = await Promise.all([
            alderAccessCheck().check(),
            selvstendigAccessCheck().check(),
            frilanserAccessCheck().check(),
        ]);
        const canUseApplication = alderResult.passes && (selvstendigResult.passes || frilanserResult.passes);
        const profile: ApplicantProfile = {
            isFrilanser: frilanserResult.passes,
            isSelvstendig: selvstendigResult.passes,
        };
        setAccessCheckState({
            pending: false,
            complete: true,
            result: {
                canUseApplication,
                checks: {
                    alder: alderResult,
                    frilanser: frilanserResult,
                    selvstendig: selvstendigResult,
                },
                profile,
            },
        });
        appContext?.setApplicantProfile(profile);
    }

    useEffect(() => {
        runChecks();
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
                        if (result) {
                            return (
                                <>
                                    <FormBlock>
                                        <Undertittel>Perioder og frister</Undertittel>
                                        <p>
                                            Periode det søkes for: <DateRangeView dateRange={applicationDateRange} />
                                        </p>
                                        <p>
                                            Gyldig søknadsperiode for frilansere:{' '}
                                            <DateRangeView dateRange={frilansDateRange} />
                                        </p>
                                        <p>
                                            Gyldig søknadsperiode for selvstendig næringsdrivende:{' '}
                                            <DateRangeView dateRange={selvstendigDateRange} />
                                        </p>
                                    </FormBlock>
                                    <FormBlock>
                                        <AccessCheckResultList
                                            canUseApplicaton={result.canUseApplication}
                                            accessChecks={result.checks}
                                            profile={result.profile}
                                        />
                                        {companies && (
                                            <>
                                                <Undertittel>Dine registrerte enkeltpersonforetak</Undertittel>
                                                <ul>
                                                    {companies.enkeltpersonforetak.map((e) => {
                                                        return (
                                                            <li key={e.organisasjonsnummer}>
                                                                <div>{e.navn}</div>
                                                                Orgnr: {e.organisasjonsnummer}:. Registrert{' '}
                                                                {prettifyDate(e.registreringsdato)}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </>
                                        )}
                                    </FormBlock>
                                    {result.canUseApplication && (
                                        <FormBlock>
                                            <ConfirmationForm onStart={onStart} />
                                        </FormBlock>
                                    )}
                                    {!result.canUseApplication && (
                                        <FormBlock margin="xl">
                                            <Panel border={true}>
                                                <Undertittel>Du kan ikke bruke denne søknaden</Undertittel>
                                                <p>
                                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum ea
                                                    magni id omnis. At, deserunt quae nihil molestias ut aspernatur
                                                    itaque optio corrupti totam. Ducimus ipsa maxime possimus fugit eos?
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
                                                                Reprehenderit qui in ea voluptate velit esse quam nihil
                                                                molestiae consequatur
                                                            </Lenke>
                                                        </li>
                                                    </ul>
                                                </Box>
                                            </Panel>
                                        </FormBlock>
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
