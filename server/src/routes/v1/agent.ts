import express from 'express';
import {
  change_password_controller,
  change_password_validator,
} from '../../controllers/agent/change-password';
import {
  change_agent_username_body_validator,
  change_agent_username_controller,
} from '../../controllers/agent/change-username';
import {
  create_agent_body_validator,
  create_agent_controller,
} from '../../controllers/agent/create';
import { get_current_agent_controller } from '../../controllers/agent/current-user';
import get_all_agents_controller from '../../controllers/agent/get-all';
import {
  agent_login_body_validator,
  agent_login_controller,
} from '../../controllers/agent/login';
import { logout } from '../../controllers/agent/logout';
import {
  non_activate_agent_controller,
  non_activate_agent_validator,
} from '../../controllers/agent/non-activate';
import {
  reset_agent_password_body_validator,
  reset_agent_password_controller,
} from '../../controllers/agent/reset-password';
import { is_token_valid } from '../../controllers/agent/token-is-valid';
import {
  require_auth,
  require_master,
  validate_request,
} from '../../middlewares';

const router = express.Router();

router.post(
  '/create',
  require_auth,
  require_master,
  create_agent_body_validator,
  validate_request,
  create_agent_controller
);

router.post(
  '/login',
  agent_login_body_validator,
  validate_request,
  agent_login_controller
);

router.post('/logout', logout);
router.get('/is-token-valid', is_token_valid);
router.get('/current', get_current_agent_controller);

router.get('/get-all', require_auth, require_master, get_all_agents_controller);

router.patch(
  '/reset-password',
  require_auth,
  require_master,
  reset_agent_password_body_validator,
  validate_request,
  reset_agent_password_controller
);

router.patch(
  '/change-username',
  require_auth,
  require_master,
  change_agent_username_body_validator,
  validate_request,
  change_agent_username_controller
);

router.patch(
  '/change-password',
  require_auth,
  change_password_validator,
  validate_request,
  change_password_controller
);

router.patch(
  '/non-activate/:agent_id',
  require_auth,
  require_master,
  non_activate_agent_validator,
  validate_request,
  non_activate_agent_controller
);

export { router as agent_router_v1 };
