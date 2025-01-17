export type ActionButtonColor = 'primary' | 'danger' | 'warning';
export type ActionButtonShape = 'DEFAULT' | 'FLAT' | 'OUTLINE';

export class ActionButtonStyle {
  constructor(
    public options: {
      color?: ActionButtonColor;
      shape?: ActionButtonShape;
    }
  ) {}

  get color(): ActionButtonColor {
    return this.options?.color;
  }

  get shape(): ActionButtonShape {
    return this.options?.shape || 'DEFAULT';
  }

  get isDefault(): boolean {
    return this.shape === 'DEFAULT';
  }

  get isOutlined(): boolean {
    return this.shape === 'OUTLINE';
  }

  get isFlat(): boolean {
    return this.shape === 'FLAT';
  }
}

export interface TableActionOption {
  id: string;
  actionCode: string;
  name: string;
  icon?: string;
  needConfirmation?: boolean;
  confirmationType?: string;
  confirmationText?: string;
  authority?: string;
  buttonStyle?: ActionButtonStyle;
}
