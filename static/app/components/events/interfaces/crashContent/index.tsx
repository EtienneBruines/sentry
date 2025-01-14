import * as React from 'react';

import {ExceptionType, ExceptionValue, PlatformType} from 'app/types';

import Exception from './exception';
import Stacktrace from './stacktrace';

type ExceptionProps = React.ComponentProps<typeof Exception>;
type Props = Pick<
  ExceptionProps,
  | 'stackType'
  | 'stackView'
  | 'projectId'
  | 'event'
  | 'newestFirst'
  | 'groupingCurrentLevel'
  | 'hasHierarchicalGrouping'
> & {
  exception?: ExceptionType;
  stacktrace?: ExceptionValue['stacktrace'];
};

const CrashContent = ({
  event,
  stackView,
  stackType,
  newestFirst,
  projectId,
  groupingCurrentLevel,
  hasHierarchicalGrouping,
  exception,
  stacktrace,
}: Props) => {
  const platform = (event.platform ?? 'other') as PlatformType;

  if (exception) {
    return (
      <Exception
        stackType={stackType}
        stackView={stackView}
        projectId={projectId}
        newestFirst={newestFirst}
        event={event}
        platform={platform}
        values={exception.values}
        hasHierarchicalGrouping={hasHierarchicalGrouping}
        groupingCurrentLevel={groupingCurrentLevel}
      />
    );
  }

  if (stacktrace) {
    return (
      <Stacktrace
        stacktrace={stacktrace}
        stackView={stackView}
        newestFirst={newestFirst}
        event={event}
        platform={platform}
        hasHierarchicalGrouping={hasHierarchicalGrouping}
        groupingCurrentLevel={groupingCurrentLevel}
      />
    );
  }

  return null;
};

export default CrashContent;
