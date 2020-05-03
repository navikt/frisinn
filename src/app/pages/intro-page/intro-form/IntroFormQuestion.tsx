import React from 'react';
import { introFormText } from './introFormTexts';
import StopMessage from '../../../components/stop-message/StopMessage';
import FormikYesOrNoQuestion, {
    FormikYesOrNoQuestionProps,
} from '@navikt/sif-common-formik/lib/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { IntroFormField } from './introFormConfig';
import InfoMessage from '../../../components/info-message/InfoMessage';
import QuestionVisibilityBlock from '../../../components/question-visibility-block/QuestionVisibilityBlock';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';

interface Props extends FormikYesOrNoQuestionProps<IntroFormField> {
    showStop?: boolean;
    description?: React.ReactNode;
    stopMessage?: React.ReactNode;
    infoMessage?: React.ReactNode;
    showInfo?: boolean;
    legend?: React.ReactNode;
    children?: React.ReactNode;
}

const IntroFormQuestion = ({
    name,
    showStop,
    description,
    stopMessage,
    showInfo,
    infoMessage,
    legend,
    children,
}: Props) => {
    return (
        <QuestionVisibilityBlock<IntroFormField> fieldName={name}>
            <FormBlock>
                {children || (
                    <>
                        <FormikYesOrNoQuestion
                            name={name}
                            legend={legend || introFormText[name]}
                            description={description}
                        />
                    </>
                )}
                <div aria-live="polite">
                    {showStop && stopMessage && <StopMessage>{stopMessage}</StopMessage>}
                    {showInfo && infoMessage && <InfoMessage>{infoMessage}</InfoMessage>}
                </div>
            </FormBlock>
        </QuestionVisibilityBlock>
    );
};

export default IntroFormQuestion;
