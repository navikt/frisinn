import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import AvbrytSoknadDialog from '@navikt/sif-common-core/lib/components/dialogs/avbrytSøknadDialog/AvbrytSøknadDialog';
import FortsettSoknadSenereDialog from '@navikt/sif-common-core/lib/components/dialogs/fortsettSøknadSenereDialog/FortsettSøknadSenereDialog';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import './stepFooter.less';

interface Props {
    onAvbrytOgFortsettSenere?: () => void;
    onAvbrytOgSlett?: () => void;
}

function StepFooter({ onAvbrytOgFortsettSenere, onAvbrytOgSlett }: Props) {
    const [visAvbrytDialog, setVisAvbrytDialog] = React.useState<boolean>(false);
    const [visFortsettSenereDialog, setVisFortsettSenereDialog] = React.useState<boolean>(false);

    if (!onAvbrytOgFortsettSenere && !onAvbrytOgSlett) {
        return null;
    }
    const bem = bemUtils('stepFooter');
    return (
        <>
            <div className={bem.block}>
                <div className={bem.element('divider')} />
                <div className={bem.element('links')}>
                    {onAvbrytOgFortsettSenere && (
                        <ActionLink onClick={() => setVisFortsettSenereDialog(true)}>
                            <FormattedMessage id="steg.footer.fortsettSenere" />
                        </ActionLink>
                    )}
                    {onAvbrytOgFortsettSenere && onAvbrytOgSlett && (
                        <span className={bem.element('dot')} aria-hidden={true} />
                    )}
                    {onAvbrytOgSlett && (
                        <ActionLink
                            className={bem.element('avbrytSoknadLenke')}
                            onClick={() => setVisAvbrytDialog(true)}>
                            <FormattedMessage id="steg.footer.avbryt" />
                        </ActionLink>
                    )}
                </div>
            </div>
            {onAvbrytOgFortsettSenere && (
                <FortsettSoknadSenereDialog
                    synlig={visFortsettSenereDialog}
                    onFortsettSøknadSenere={onAvbrytOgFortsettSenere}
                    onFortsettSøknad={() => setVisFortsettSenereDialog(false)}
                />
            )}
            {onAvbrytOgSlett && (
                <AvbrytSoknadDialog
                    synlig={visAvbrytDialog}
                    onAvbrytSøknad={onAvbrytOgSlett}
                    onFortsettSøknad={() => setVisAvbrytDialog(false)}
                />
            )}
        </>
    );
}

export default StepFooter;
