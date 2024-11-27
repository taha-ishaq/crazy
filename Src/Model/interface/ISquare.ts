export declare namespace ISquare {
	interface PaymentLinkRes {
		payment_link: PaymentLink
		related_resources: RelatedResources
	}

	interface PaymentLink {
		id: string
		version: number
		description: string
		order_id: string
		pre_populated_data: PrePopulatedData
		url: string
		long_url: string
		created_at: string
	}

	interface PrePopulatedData {
		buyer_email: string
		buyer_phone_number: string
		buyer_address: BuyerAddress
	}

	interface BuyerAddress {
		address_line_1: string
		locality: string
		administrative_district_level_1: string
		postal_code: string
	}

	interface RelatedResources {
		orders: Order[]
	}

	interface Order {
		id: string
		location_id: string
		source: Source
		line_items: LineItem[]
		fulfillments: Fulfillment[]
		net_amounts: NetAmounts
		created_at: string
		updated_at: string
		state: string
		version: number
		total_money: TotalMoney3
		total_tax_money: TotalTaxMoney2
		total_discount_money: TotalDiscountMoney2
		total_tip_money: TotalTipMoney
		total_service_charge_money: TotalServiceChargeMoney2
		net_amount_due_money: NetAmountDueMoney
	}

	interface Source {
		name: string
	}

	interface LineItem {
		uid: string
		name: string
		quantity: string
		item_type: string
		base_price_money: BasePriceMoney
		variation_total_price_money: VariationTotalPriceMoney
		gross_sales_money: GrossSalesMoney
		total_tax_money: TotalTaxMoney
		total_discount_money: TotalDiscountMoney
		total_money: TotalMoney
		total_service_charge_money: TotalServiceChargeMoney
	}

	interface BasePriceMoney {
		amount: number
		currency: string
	}

	interface VariationTotalPriceMoney {
		amount: number
		currency: string
	}

	interface GrossSalesMoney {
		amount: number
		currency: string
	}

	interface TotalTaxMoney {
		amount: number
		currency: string
	}

	interface TotalDiscountMoney {
		amount: number
		currency: string
	}

	interface TotalMoney {
		amount: number
		currency: string
	}

	interface TotalServiceChargeMoney {
		amount: number
		currency: string
	}

	interface Fulfillment {
		uid: string
		type: string
		state: string
	}

	interface NetAmounts {
		total_money: TotalMoney2
		tax_money: TaxMoney
		discount_money: DiscountMoney
		tip_money: TipMoney
		service_charge_money: ServiceChargeMoney
	}

	interface TotalMoney2 {
		amount: number
		currency: string
	}

	interface TaxMoney {
		amount: number
		currency: string
	}

	interface DiscountMoney {
		amount: number
		currency: string
	}

	interface TipMoney {
		amount: number
		currency: string
	}

	interface ServiceChargeMoney {
		amount: number
		currency: string
	}

	interface TotalMoney3 {
		amount: number
		currency: string
	}

	interface TotalTaxMoney2 {
		amount: number
		currency: string
	}

	interface TotalDiscountMoney2 {
		amount: number
		currency: string
	}

	interface TotalTipMoney {
		amount: number
		currency: string
	}

	interface TotalServiceChargeMoney2 {
		amount: number
		currency: string
	}

	interface NetAmountDueMoney {
		amount: number
		currency: string
	}
}
