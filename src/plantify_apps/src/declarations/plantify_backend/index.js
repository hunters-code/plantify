import { Actor, HttpAgent } from '@dfinity/agent';

// Imports and re-exports candid interface
import { idlFactory } from './plantify_backend.did.js';

export { idlFactory } from './plantify_backend.did.js';

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
// Use environment variable or fallback to hardcoded ID
export const canisterId =
  process.env.CANISTER_ID_PLANTIFY_BACKEND || 'a5ptu-ryaaa-aaaai-q32cq-cai';

export const createActor = (canisterIdParam, options = {}) => {
  // Always ensure we have a valid canister ID
  const effectiveCanisterId =
    canisterIdParam || canisterId || 'a5ptu-ryaaa-aaaai-q32cq-cai';

  if (!effectiveCanisterId) {
    throw new Error('Canister ID is required but not provided');
  }
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      'Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.'
    );
  }

  // Skip fetchRootKey to avoid HTTP errors
  console.log('Skipping fetchRootKey in development environment');

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: effectiveCanisterId,
    ...options.actorOptions,
  });
};

// Always create the actor with our hardcoded fallback if needed
export const plantify_backend = createActor(canisterId);
