import { Link } from 'react-router-dom';
import { Check, Clock } from 'lucide-react';
import { Badge, Button } from '../../components/ui';
import { CONNECTION } from '../../lib/constants';

/** The main action for another member, depending on where things stand between you. */
export function ConnectionAction({ connection, onRequest, size = 'sm', canRequest = true }) {
  switch (connection?.status) {
    case CONNECTION.CONNECTED:
      return (
        <Badge tone="green">
          <Check className="h-3 w-3" aria-hidden="true" /> Connected
        </Badge>
      );
    case CONNECTION.REQUEST_SENT:
      return (
        <Badge tone="amber">
          <Clock className="h-3 w-3" aria-hidden="true" /> Request sent
        </Badge>
      );
    case CONNECTION.REQUEST_RECEIVED:
      return (
        <Button as={Link} to="/requests" size={size} variant="subtle">
          Respond to request
        </Button>
      );
    default:
      return canRequest ? (
        <Button size={size} onClick={onRequest}>
          Request swap
        </Button>
      ) : null;
  }
}
