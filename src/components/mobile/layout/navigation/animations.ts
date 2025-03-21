export const floatingButtonVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      delay: index * 0.02,
      type: 'spring',
      stiffness: 600,
      damping: 35,
      mass: 0.5,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    y: 10,
    scale: 0.8,
    transition: {
      duration: 0.1,
      delay: index * 0.02,
    },
  }),
}

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.3,
    transition: { duration: 0.15 },
  },
}

export const fabVariants = {
  closed: { rotate: 0, scale: 1 },
  open: {
    rotate: 45,
    scale: 1.1,
    transition: { duration: 0.2, type: 'spring', stiffness: 500 },
  },
}
