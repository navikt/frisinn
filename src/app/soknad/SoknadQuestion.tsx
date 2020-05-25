import React from 'react';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import FormikYesOrNoQuestion, {
    FormikYesOrNoQuestionProps,
} from '@navikt/sif-common-formik/lib/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import InfoMessage from '../components/info-message/InfoMessage';
import QuestionVisibilityBlock from '../components/question-visibility-block/QuestionVisibilityBlock';
import StopMessage from '../components/stop-message/StopMessage';
import { SoknadFormField } from '../types/SoknadFormData';
import { soknadQuestionText } from './soknadQuestionText';

interface Props extends Omit<FormikYesOrNoQuestionProps<SoknadFormField>, 'info'> {
    showStop?: boolean;
    description?: React.ReactNode;
    stopMessage?: React.ReactNode;
    infoMessage?: React.ReactNode;
    showInfo?: boolean;
    legend?: React.ReactNode;
    children?: React.ReactNode;
    margin?: BoxMargin;
}

const SoknadQuestion = ({
    name,
    showStop,
    description,
    stopMessage,
    showInfo,
    infoMessage,
    legend,
    children,
    margin,
}: Props) => {
    if (typeof legend === 'function') {
        console.error('SoknadQuestion: Invalid legend prop - cannot be a function');
    }
    return (
        <QuestionVisibilityBlock<SoknadFormField> fieldName={name}>
            <FormBlock margin={margin}>
                {children || (
                    <FormikYesOrNoQuestion
                        name={name}
                        legend={legend || soknadQuestionText[name]}
                        description={description}
                        validate={validateYesOrNoIsAnswered}
                    />
                )}
                <div aria-live="polite">
                    {showStop && stopMessage && <StopMessage margin="l">{stopMessage}</StopMessage>}
                    {showInfo && infoMessage && <InfoMessage margin="l">{infoMessage}</InfoMessage>}
                </div>
            </FormBlock>
        </QuestionVisibilityBlock>
    );
};

export default SoknadQuestion;
