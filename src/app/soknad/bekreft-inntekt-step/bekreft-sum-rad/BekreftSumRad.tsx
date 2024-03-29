import React from 'react';
import { Link } from 'react-router-dom';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import StopMessage from '../../../components/stop-message/StopMessage';
import { SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';
import { getSoknadRoute } from '../../../utils/routeUtils';
import SoknadFormComponents from '../../SoknadFormComponents';
import { StepID } from '../../stepConfig';
import KronerSvar from '../../summary-step/KronerSvar';
import './bekreftSumRad.less';
import useWindowSize from '../../../hooks/useWindowSize';

interface Props {
    values: SoknadFormData;
    field: SoknadFormField;
    tittel: React.ReactNode;
    sum?: number;
    info?: React.ReactNode;
    editStepID: StepID;
}

const bem = bemUtils('bekreftSumRad');

const BekreftSumRad = ({ field, tittel, sum, info, values, editStepID }: Props) => {
    const x = useWindowSize();
    const useTwoColumns = x.width > 600;
    return (
        <div className={bem.block}>
            <SoknadFormComponents.YesOrNoQuestion
                useTwoColumns={useTwoColumns}
                name={field}
                legend={
                    <div className={bem.element('tittelOgSum')}>
                        <div className={bem.element('tittel')}>{tittel}</div>
                        <strong className={bem.element('sum')}>
                            {sum !== undefined && <KronerSvar verdi={sum} />}
                        </strong>
                    </div>
                }
                labels={{
                    yes: 'Ja, dette er korrekt',
                    no: 'Nei, dette er ikke korrekt',
                }}
                validate={validateYesOrNoIsAnswered}
                description={info ? <div className={bem.element('info')}>{info}</div> : undefined}
            />
            {values[field] === YesOrNo.NO && (
                <StopMessage margin="l">
                    Du må korrigere tallene du har lagt inn feil,{' '}
                    <Link className="lenke" to={getSoknadRoute(editStepID)}>
                        det gjør du her
                    </Link>
                    .
                </StopMessage>
            )}
        </div>
    );
};
export default BekreftSumRad;
