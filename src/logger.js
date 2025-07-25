export const Log = async (stack, level, packageName, message) => {
  const allowedStacks = ['frontend', 'backend'];
  const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const allowedPackages = [
    'api', 'component', 'hook', 'page', 'state', 'style',
    'auth', 'config', 'middleware', 'utils'
  ];

  if (!allowedStacks.includes(stack) || !allowedLevels.includes(level) || !allowedPackages.includes(packageName)) {
    console.error('Invalid log params');
    return;
  }

  try {
    const res = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stack, level, package: packageName, message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  } catch (err) {
    console.error('Logging error:', err.message);
  }
};