import {browserHistory, withRouter, WithRouterProps} from 'react-router';
import styled from '@emotion/styled';
import {Query} from 'history';

import Button from 'app/components/button';
import ButtonBar from 'app/components/buttonBar';
import {IconChevron} from 'app/icons';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {callIfFunction} from 'app/utils/callIfFunction';
import parseLinkHeader from 'app/utils/parseLinkHeader';

type Props = WithRouterProps & {
  pageLinks?: string | null;
  to?: string;
  /**
   * The caption must be the PaginationCaption component
   */
  caption?: React.ReactElement;
  size?: 'zero' | 'xsmall' | 'small';
  onCursor?: (cursor: string, path: string, query: Query, _direction: number) => void;
  disabled?: boolean;
  className?: string;
};

const defaultOnCursor = (
  cursor: string,
  path: string,
  query: Query,
  _direction: number
) =>
  browserHistory.push({
    pathname: path,
    query: {...query, cursor},
  });

const Pagination = ({
  to,
  location,
  className,
  onCursor = defaultOnCursor,
  pageLinks,
  size = 'small',
  caption,
  disabled = false,
}: Props) => {
  if (!pageLinks) {
    return null;
  }

  const path = to ?? location.pathname;
  const query = location.query;
  const links = parseLinkHeader(pageLinks);
  const previousDisabled = disabled || links.previous.results === false;
  const nextDisabled = disabled || links.next.results === false;

  return (
    <Wrapper className={className}>
      {caption}
      <ButtonBar merged>
        <Button
          icon={<IconChevron direction="left" size="sm" />}
          aria-label={t('Previous')}
          size={size}
          disabled={previousDisabled}
          onClick={() => {
            callIfFunction(onCursor, links.previous.cursor, path, query, -1);
          }}
        />
        <Button
          icon={<IconChevron direction="right" size="sm" />}
          aria-label={t('Next')}
          size={size}
          disabled={nextDisabled}
          onClick={() => {
            callIfFunction(onCursor, links.next.cursor, path, query, 1);
          }}
        />
      </ButtonBar>
    </Wrapper>
  );
};

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: ${space(3)} 0 0 0;
`;

export default withRouter(Pagination);
