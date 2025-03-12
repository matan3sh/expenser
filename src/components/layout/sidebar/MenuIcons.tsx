'use client'

import {
  DollarSign,
  HomeIcon,
  LineChart,
  Palette,
  PlusCircle,
  Settings,
  Upload,
} from 'lucide-react'

export const MenuIcons = {
  Home: () => <HomeIcon className="h-4 w-4" />,
  Dollar: () => <DollarSign className="h-4 w-4" />,
  Chart: () => <LineChart className="h-4 w-4" />,
  Palette: () => <Palette className="h-4 w-4" />,
  Settings: () => <Settings className="h-4 w-4" />,
  Plus: () => <PlusCircle className="h-4 w-4" />,
  Upload: () => <Upload className="h-4 w-4" />,
}
