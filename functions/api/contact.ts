// Only used if the site runs on Cloudflare Pages instead of Workers. Same handler as the Worker.
import { handleContact, type ContactEnv } from '../../worker/contact';

export const onRequest = ({ request, env }: { request: Request; env: ContactEnv }) => handleContact(request, env);
