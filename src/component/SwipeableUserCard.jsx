import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const SwipeableUserCard = ({ user, onSwipe }) => {
    const name = user.firstName + " " + user.lastName;
  const [{ x, y, rot, scale, likeOpacity, nopeOpacity }, api] = useSpring(() => ({
    x: 0, y: 0, rot: 0, scale: 1, likeOpacity: 0, nopeOpacity: 0,
    config: { tension: 300, friction: 40 },
  }));

  const bind = useDrag(({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
    const triggerX = window.innerWidth / 3;
    const triggerY = window.innerHeight / 4;
    const horizontalDirection = mx > 0 ? 1 : -1;

    if (active) {
      const newRot = mx / 20;
      const likeOp = mx > 0 ? Math.min(mx / (triggerX * 0.75), 1) : 0;
      const nopeOp = mx < 0 ? Math.min(Math.abs(mx) / (triggerX * 0.75), 1) : 0;
      api.start({
        x: mx, y: my, rot: newRot, scale: 1.05, likeOpacity: likeOp, nopeOpacity: nopeOp,
        config: { friction: 50, tension: 500 }
      });
    }

    if (!active) {
      if (Math.abs(mx) > triggerX) {
        onSwipe(horizontalDirection > 0 ? 'right' : 'left');
        api.start({ x: (200 + window.innerWidth) * horizontalDirection, rot: mx / 100 + horizontalDirection * 10 * vx, scale: 1 });
        return;
      }
      if (Math.abs(my) > triggerY) {
        const verticalDirection = dy > 0 ? 1 : -1;
        onSwipe(verticalDirection === -1 ? 'up' : 'down');
        api.start({ y: (verticalDirection === -1 ? -1 : 1) * (200 + window.innerHeight), rot: mx / 100 + dx * 10 * vx });
        return;
      }
      api.start({ x: 0, y: 0, rot: 0, scale: 1, likeOpacity: 0, nopeOpacity: 0 });
    }
  });

  if (!user) return null;

  return (
    <animated.div
      {...bind()}
      style={{ x, y, rotate: rot, scale, touchAction: 'none' }}
      className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
    > 
      <animated.div
        className="absolute top-12 left-8 text-[#cb83ff] text-4xl md:text-5xl font-extrabold border-4 border-[#cb83ff] rounded-xl py-2 px-4 transform -rotate-12 pointer-events-none"
        style={{ opacity: likeOpacity }}>
        LIKE
      </animated.div>
      <animated.div
        className="absolute top-12 right-8 text-gray-400 text-4xl md:text-5xl font-extrabold border-4 border-gray-400 rounded-xl py-2 px-4 transform rotate-12 pointer-events-none"
        style={{ opacity: nopeOpacity }}>
        NOPE
      </animated.div>

      <img src={user.photoUrl} alt={`${user.firstName}'s post`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-[#2c1857]/40 to-transparent p-5">
        <div className="transition-transform duration-500 ease-in-out">
          <div className="flex items-center space-x-4">
            <img src={user.photoUrl} alt={user.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-white/80" />
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">{name}</h3>
              <p className="text-sm text-gray-200">{user.about}</p>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};
export default SwipeableUserCard;