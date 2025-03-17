"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";

enum GenderEnum {
  male = "male",
  female = "female",
  other = "other",
}

interface FormInput {
  firstName: string;
  lastName: string;
  fristName: string;
  email: string;
  gender: GenderEnum;
  soial: {
    facebook: string;
    twitter: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  dob: Date;
  test: {
    firstName: string;
    lastName: string;
  }[];
}

const Forms = () => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isDirty, isValid, isSubmitSuccessful },
    watch,
    getValues,
    setValue,
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      fristName: "badon111",
      email: "",
      soial: {
        facebook: "",
        twitter: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      test: [{ firstName: "badon", lastName: "islam," }],
      dob: new Date(),
    },
    mode: "onTouched",
  });

  const {
    fields: testField,
    append: appendTest,
    remove: removeTest,
  } = useFieldArray({
    name: "test",
    control,
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormInput) => {
    console.log(data);
  };

  const handleGetValues = () => {
    console.log("get values", getValues("soial"));
  };

  const handleSetValues = () => {
    setValue("fristName", "", {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const onError = (errors: FieldErrors<FormInput>) => {
    console.log(errors, "form errors");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
  const watchuser = watch("fristName");
  const renderCount = testField.length;
  return (
    <div className="p-10 flex  items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <input {...register("firstName", { required: true })} />
        <input {...register("lastName", { required: true })} />
        <button
          type="button"
          onClick={() => {
            trigger("lastName");
          }}
        >
          Trigger
        </button>
        <button
          type="button"
          onClick={() => {
            trigger(["firstName", "lastName"]);
          }}
        >
          Trigger Multiple
        </button>
        <button
          type="button"
          onClick={() => {
            trigger();
          }}
        >
          Trigger All
        </button>
        {/* --------------------- */}
        {testField.map((field, index) => {
          return (
            <div key={field.id}>
              <input
                defaultValue={field.firstName}
                {...register(`test.${index}.firstName`)}
              />
              <input
                defaultValue={field.lastName}
                {...register(`test.${index}.lastName`)}
              />
              <button
                className="px-4 py-2 roundd-md bg-amber-400 text-white"
                type="button"
                onClick={() => removeTest(index)}
              >
                Remove
              </button>
            </div>
          );
        })}
        <button
          className="px-4 py-2 roundd-md bg-orange-400"
          type="button"
          onClick={() =>
            appendTest({
              firstName: "" + renderCount,
              lastName: "" + renderCount,
            })
          }
        >
          Append
        </button>
        {/* ======================= */}

        <div>
          <div>
            <h2 className="text-3xl text-purple-500 mb-5">
              watch value : {watchuser}
            </h2>
            <button
              type="button"
              onClick={() => reset()}
              className="bg-amber-200 px-3 py-3 me-3"
            >
              {" "}
              Reset
            </button>

            <button
              type="button"
              onClick={handleSetValues}
              className="bg-amber-200 px-3 py-3 me-3"
            >
              {" "}
              set Values
            </button>

            <button
              type="button"
              onClick={handleGetValues}
              className="bg-amber-200 px-3 py-3"
            >
              {" "}
              get Values
            </button>
          </div>

          <label htmlFor="" className="text-sm font-semibold text-red-300">
            Date Of birth
          </label>
          <input
            type="date"
            {...register("dob", { required: true, valueAsDate: true })}
            className="border py-2"
          />

          {errors.dob && (
            <p className="text-red-500">date is requerd and must be use</p>
          )}
        </div>

        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            Frist Name
          </label>
          <input
            type="text"
            {...register("fristName", { required: true, minLength: 5 })}
            className="border py-2"
          />

          {errors.fristName && (
            <p className="text-red-500">
              Frist Name is requerd and must be use 5 carecter
            </p>
          )}
        </div>

        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            email
          </label>
          <input
            type="email"
            {...register("email", {
              validate: {
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length == 0 || "emial is alerey here";
                },
              },
            })}
            className="border py-2"
          />
          <p className="text-yellow-500">{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            facebook
          </label>
          <input
            type="text"
            {...register("soial.facebook", {
              required: {
                value: true,
                message: "facebook is requerd",
              },
            })}
            className="border py-2"
          />

          <p className="text-red-600">{errors.soial?.facebook?.message}</p>
        </div>

        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            Twitter
          </label>
          <input
            type="text"
            className="border"
            {...register("soial.twitter", {
              required: {
                value: true,
                message: "twitter is requerd",
              },
            })}
          />
          <p className="text-red-400">{errors.soial?.twitter?.message}</p>
        </div>

        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            Phone numbers
          </label>
          <input
            type="text"
            className="border"
            {...register("phoneNumbers.0", {
              required: {
                value: true,
                message: "phone number is requerd",
              },
            })}
          />
          <p className="text-red-400">{errors.phoneNumbers?.message}</p>
        </div>
        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            Phone numbers 2
          </label>
          <input
            type="text"
            className="border"
            {...register("phoneNumbers.1", {
              required: {
                value: true,
                message: "phone1 number is requerd",
              },
            })}
          />
          <p className="text-red-400">{errors.phoneNumbers?.message}</p>
        </div>

        <div>
          <label htmlFor="" className="text-sm font-semibold text-red-300">
            Gender
          </label>
          <select id="" {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="html">List Of Phone number</label>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            phoneFields.map((field: any, index: any) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    className="border"
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="text-sm text-white bg-yellow-700 px-4 py-2 mt-3"
                      onClick={() => removePhone(index)}
                    >
                      Remove phone numer
                    </button>
                  )}
                </div>
              );
            })
          }
          <button
            type="button"
            className="text-sm text-white bg-yellow-700 px-4 py-2 mt-3"
            onClick={() => appendPhone({ number: "" })}
          >
            Add phone numer
          </button>
        </div>
        <button
          type="submit"
          className="text-lg bg-green-500 text-white px-5 py-2 mt-5"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Forms;
